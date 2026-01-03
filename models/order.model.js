import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : "User"
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref : "Product"
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : "Address"
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      required: true,
    },
    coupen_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "cod"],
      default: "pending",
    },
    amount: {
      type: String,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      default: "",
    },
    razorpay_payment_id: {
      type: String,
      default: "",
    },
    razorpay_signature: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

orderSchema.index(
  { user_id: 1, paymentMethod: 1 },
  {
    unique: true,
    partialFilterExpression: {
      payment_status: "pending",
      paymentMethod: "online",
    },
  }
);

export default mongoose.model("Order", orderSchema);
