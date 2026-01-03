import AdminService from "../../service/admin.service/admin.service.js";
import CategoryModel from "../../models/category.model.js";
import ProductModel from "../../models/product.model.js";
import uploadTheImage from "../../utils/cloudinary.js";
import fs from "fs"
const DATA_ALLOWED = [
  "productname",
  "description",
  "quantity",
  "howToUse",
  "images",
  "highlights",
  "price",
];

const AdminController = {
  AddCategory: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "name are requerd" });
      }
      if (!req.file.path) {
        return res.status(400).json({ error: "image are requerd" });
      }

      const category = await AdminService.AddCategory(name, req.file.path);

      res.status(201).json({ message: "category created", Category: category });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error?.message });
    }
  },
  EditCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      if (name) {
        category.name = name;
      }

      if (req.file?.path) {
        const uploadedImage = await uploadTheImage(req.file.path);
        category.image = uploadedImage?.secure_url;
        fs.unlinkSync(req.file?.path);
      }

      await category.save();

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
      });
    } catch (error) {
      console.error("Edit Category Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  AddProduct: async (req, res) => {
    try {
      if (!req.files) {
        return res.status(400).json({ error: "images are required" });
      }
      const product = await AdminService.AddProduct(req.body, req.files);

      res.status(201).json({ message: "product added", Product: product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error?.message });
    }
  },
  Updateproduct: async (req, res) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin is not valid" });
      }

      const { product_id } = req.params;

      const isAllowed = Object.keys(req.body).every((key) =>
        DATA_ALLOWED.includes(key)
      );

      if (!isAllowed) {
        return res.status(400).json({
          message: "Invalid fields in request body",
        });
      }

      const updateData = {};
      DATA_ALLOWED.forEach((key) => {
        if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message: "No valid fields provided to update",
        });
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        product_id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({
        message: "Product Updated",
        data: updatedProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  DeleteProduct: async (req, res) => {
    try {
      const deletedproduct = await AdminService.DeleteProduct(
        req.params.productId
      );

      res
        .status(200)
        .json({ message: "product deleted", product: deletedproduct });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error?.message });
    }
  },
  getCategories: async (req, res) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }
      const cats = await CategoryModel.find({});
      return res.status(200).json({ message: "Success", data: cats });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getProducts: async (req, res) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin is not valid" });
      }
      const products = await ProductModel.find({}).populate(
        "category",
        "image name"
      );
      return res.status(200).json({ message: "Success", products: products });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin is not valid" });
      }
      const { cat_id } = req.params;
      if (!cat_id) {
        return res.status(400).json({ message: "Category id is required" });
      }
      const isDeleted = await CategoryModel.findByIdAndDelete(cat_id);
      if (!isDeleted) {
        return res.status(400).json({ message: "Category not found" });
      }
      return res
        .status(200)
        .json({ message: "Category deleted successfully " });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default AdminController;
