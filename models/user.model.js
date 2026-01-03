import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 30,
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      validate: {
        validator: (value) => validator.isMobilePhone(value, "en-IN"),
        message: "Please enter a valid 10-digit mobile number",
      },
    },
  },
  { timestamps: true }
);

// UserSchema.index({ email: 1 });

export default mongoose.model("User", UserSchema);
