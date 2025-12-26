import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productname: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },

    images: [
      {
        type: String,
      },
    ],

    howToUse: {
      type: String,
    },

    highlights: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);