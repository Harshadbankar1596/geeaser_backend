import ProductModel from "../../models/product.model.js";
import CoupensModel from "../../models/coupen.model.js";
import categoryModel from "../../models/category.model.js";

const user_Product_Controller = {
  async getAllProducts(req, res) {
    try {
      const pro = await ProductModel.find({}).populate(
        "category",
        "image name"
      );
      return res.status(200).json({ message: "Success", data: pro });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async getAllCoupens(req, res) {
    try {
      const coupens = await CoupensModel.find({});
      return res.status(200).json({ message: "Success", data: coupens });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async getCategories(req, res) {
    try {
      const cats = await categoryModel.find({});
      return res.status(200).json({ message: "Success", data: cats });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default user_Product_Controller;
