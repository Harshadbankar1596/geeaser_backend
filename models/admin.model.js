import mongoose from "mongoose";
import validator from "validator";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: (value) =>
        validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }),
      message:
        "Password must be strong (8 chars, upper, lower, number, symbol)",
    },
  },
  contact: {
    type: String,
    required: [true, "Contact number is required"],
    validate: {
      validator: (value) => validator.isMobilePhone(value, "en-IN"),
      message: "Please enter a valid 10-digit mobile number",
    },
  },
});

AdminSchema.index({email : 1})

export default mongoose.model("Admin", AdminSchema);
