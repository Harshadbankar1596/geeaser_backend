import mongoose, { mongo } from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    address: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
    pincode : {
      type : String,
      required : true,
      trim : true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
