import mongoose, { mongo } from "mongoose";

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "Product"
      }
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
