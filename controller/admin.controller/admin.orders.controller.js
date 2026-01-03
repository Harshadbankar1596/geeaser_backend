import OrderModel from "../../models/order.model.js";

const admin_Order_Controller = {
  async getAllOrders(req, res) {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin is not valid" });
      }
      const orders = await OrderModel.find({
        payment_status: { $in: ["paid", "cod"] },
      })
        .populate("user_id", "name contact")
        .populate("address_id", "address")
        .populate(
          "products.product_id",
          "productname category description quantity images howToUse highlights price"
        );
      return res.status(200).json({ message: "Success", data: orders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async makeCodCompleted(req, res) {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin is not valid" });
      }
      const { order_id } = req.params;
      if (!order_id) {
        return res.status(400).json({ message: "Order id not required" });
      }
      const orderExists = await OrderModel.findOne({
        _id: order_id,
        payment_status: "cod",
        paymentMethod: "cod",
      });
      if (!orderExists) {
        return res.status(400).json({ message: "Order does not exists" });
      }
      orderExists.payment_status = "paid";

      await orderExists.save();
      return res
        .status(200)
        .json({ message: "Payment status changed to completed" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default admin_Order_Controller;
