import ProductModel from "../../models/product.model.js";
import CartModel from "../../models/cart.model.js";
import mongoose from "mongoose";

const PRODUCT_DATA = [
  "productname",
  "description",
  "images",
  "howToUse",
  "highlights",
  "price",
];

const user_Cart_Controller = {
  async addToCart(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "User is not valid" });
      }

      const { product_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(product_id)) {
        return res.status(400).json({ message: "Invalid product id" });
      }

      const isProductExists = await ProductModel.findById(product_id);
      if (!isProductExists) {
        return res.status(400).json({ message: "Product does not exists" });
      }

      let cart = await CartModel.findOne({ user_id: user._id });

      if (cart) {
        const existingProduct = cart.products.find(
          (p) => p.product_id.toString() === product_id
        );

        if (existingProduct) {
          //   existingProduct.quantity += 1;
          return res
            .status(400)
            .json({ message: "Product already exists in the Cart" });
        } else {
          cart.products.push({ product_id });
        }
      } else {
        cart = new CartModel({
          user_id: user._id,
          products: [{ product_id }],
        });
      }
      await cart.save();

      return res.status(201).json({
        message: "Product added in the cart successfully!",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async getCartDetails(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User is not valid" });
      }
      const getCartData = await CartModel.find({ user_id: user._id }).populate(
        "products.product_id",
        PRODUCT_DATA
      );
      return res.status(200).json({ message: "Success", data: getCartData });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async removeProduct(req, res) {
    console.log("Inrouter");
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User is not valid" });
      }

      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product id" });
      }

      const cart = await CartModel.findOne({ user_id: user._id });
      if (!cart) {
        return res.status(400).json({ message: "Cart not found" });
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product_id.toString() === id
      );

      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      cart.products.splice(productIndex, 1);
      await cart.save();

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
export default user_Cart_Controller;
