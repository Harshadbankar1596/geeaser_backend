import mongoose from "mongoose";

const coupenSchema = new mongoose.Schema(
  {
    coupen_Code: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupen", coupenSchema);
