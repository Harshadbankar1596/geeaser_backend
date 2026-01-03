import cron from "node-cron";
import OrderModel from "../models/order.model.js";

cron.schedule("*/10 * * * *", async () => {
  try {
    const expiryTime = new Date(Date.now() - 30 * 60 * 1000);
    console.log("CRON");

    await OrderModel.deleteMany({
      paymentMethod: "online",
      payment_status: "pending",
      createdAt: { $lt: expiryTime },
    });
  } catch (error) {
    console.error("Cron error:", error.message);
  }
});
