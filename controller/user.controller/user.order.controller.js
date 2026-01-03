import { getRazorpayInstance } from "../../utils/razorpayInstance.js";
import ProductModel from "../../models/product.model.js";
import OrderModel from "../../models/order.model.js";
import mongoose from "mongoose";
import AddressModel from "../../models/address.model.js";
import coupenModel from "../../models/coupen.model.js";
import CartModel from "../../models/cart.model.js";

const razorpayInstance = getRazorpayInstance();
const user_Order_Controller = {
  async putOrder(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User is not valid" });
      }

      const { products, address_id, paymentMethod, coupen_id, amount } =
        req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products array is required" });
      }

      if (!address_id || !paymentMethod || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const productIds = products.map((p) => p.product_id);

      if (productIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ message: "Invalid product id found" });
      }

      const existingProducts = await ProductModel.find(
        { _id: { $in: productIds } },
        { _id: 1 }
      );

      if (existingProducts.length !== productIds.length) {
        return res
          .status(404)
          .json({ message: "One or more products do not exist" });
      }

      const isAddressExists = await AddressModel.findOne({
        _id: address_id,
      });

      if (!isAddressExists) {
        return res.status(400).json({ message: "Address does not exists" });
      }
      if (coupen_id) {
        const isCoupenExists = await coupenModel.findById(coupen_id);
        if (!isCoupenExists) {
          return res.status(400).json({ message: "Coupen does not exists" });
        }
      }

      let razorpayOrder = null;
      let orderInDb;

      if (paymentMethod === "online") {
        razorpayOrder = await razorpayInstance.orders.create({
          amount: Number(amount) * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        });

        orderInDb = await OrderModel.findOneAndUpdate(
          {
            user_id: user._id,
            payment_status: "pending",
            paymentMethod: "online",
          },
          {
            user_id: user._id,
            products,
            address_id,
            paymentMethod: "online",
            coupen_id,
            amount,
            payment_status: "pending",
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );

        return res.status(201).json({
          message: "Online order created / replaced successfully",
          razorpayOrder,
          orderId: orderInDb._id,
          public_id: process.env.RAZORPAY_KEY_ID,
        });
      }

      if (paymentMethod === "cod") {
        orderInDb = await OrderModel.create({
          user_id: user._id,
          products,
          address_id,
          paymentMethod: "cod",
          coupen_id,
          amount,
          payment_status: "cod",
        });

        let rmcart = await CartModel.findOne({ user_id: orderInDb.user_id });

        if (!rmcart) {
          console.log("Cart not found for user");
        } else {
          rmcart.products = [];
          await rmcart.save();
          console.log("cart deleted");
        }

        return res.status(201).json({
          message: "COD order created successfully",
          orderInDb,
        });
      }

      return res.status(400).json({ message: "Invalid payment method" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async verifyOrder(req, res) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        order_id,
      } = req.body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !order_id
      ) {
        return res.status(400).json({
          success: false,
          message: "All Razorpay payment fields are required",
        });
      }

      const isOrderExists = await OrderModel.findOne({
        _id: order_id,
        paymentMethod: "online",
        payment_status: "pending",
      });

      if (!isOrderExists) {
        return res.status(400).json({ message: "Order does not exists" });
      }

      const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");

      if (expectedSign !== razorpay_signature) {
        await OrderModel.findByIdAndDelete(order_id);
        return res.status(400).json({
          message: "Payment verification failed, Order removed",
        });
      }

      await OrderModel.findByIdAndUpdate(order_id, {
        payment_status: "paid",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      const removedCart = await CartModel.findOne({
        user_id: isOrderExists.user_id,
      });

      if (!removedCart) {
        console.warn("Cart not found while clearing after payment");
      } else {
        removedCart.products = [];
        await removedCart.save();
        console.log("cart deleted");
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } catch (error) {
      // await OrderModel.findByIdAndDelete(order_id);
      return res.status(500).json({ error: error.message });
    }
  },

  // async verifyOrder(req, res) {
  //   try {
  //     const {
  //       razorpay_order_id,
  //       razorpay_payment_id,
  //       razorpay_signature,
  //       order_id,
  //     } = req.body;

  //     // ✅ Validation
  //     if (
  //       !razorpay_order_id ||
  //       !razorpay_payment_id ||
  //       !razorpay_signature ||
  //       !order_id
  //     ) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "All Razorpay payment fields are required",
  //       });
  //     }

  //     // ✅ Fetch order
  //     const order = await OrderModel.findOne({
  //       _id: order_id,
  //       paymentMethod: "online",
  //     });

  //     if (!order) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Order does not exist",
  //       });
  //     }

  //     // ✅ Prevent double verification
  //     if (order.payment_status === "paid") {
  //       return res.status(200).json({
  //         success: true,
  //         message: "Payment already verified",
  //       });
  //     }

  //     // ✅ Verify Razorpay signature
  //     const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  //     const expectedSign = crypto
  //       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  //       .update(sign)
  //       .digest("hex");

  //     if (expectedSign !== razorpay_signature) {
  //       await OrderModel.findByIdAndUpdate(order_id, {
  //         payment_status: "failed",
  //       });

  //       return res.status(400).json({
  //         success: false,
  //         message: "Payment verification failed",
  //       });
  //     }

  //     // ✅ Mark order as paid
  //     await OrderModel.findByIdAndUpdate(order_id, {
  //       payment_status: "paid",
  //       razorpay_order_id,
  //       razorpay_payment_id,
  //       razorpay_signature,
  //     });

  //     const removedCart = await CartModel.findOne({
  //       user_id: order.user_id,
  //     });

  //     if (!removedCart) {
  //       console.warn("Cart not found while clearing after payment");
  //     } else {
  //       removedCart.products = [];
  //       await removedCart.save();
  //       console.log("cart deleted");
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       message: "Payment verified successfully",
  //     });
  //   } catch (error) {
  //     console.error("verifyOrder error:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal server error",
  //     });
  //   }
  // },
};

export default user_Order_Controller;
