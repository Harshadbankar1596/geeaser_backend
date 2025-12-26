import AdminModel from "../../models/admin.model.js";
import CategoryModel from "../../models/category.model.js";
import uploadTheImage from "../../utils/cloudinary.js";
import ProductModel from "../../models/product.model.js";
import fs from "fs";
const AdminService = {
  FindAdminByEmail: async (email) => {
    try {
      const admin = await AdminModel.findOne({ email });
      if (!admin) {
        throw new Error("admin not found");
      }
      return admin;
    } catch (error) {
      throw new Error("error in find admin");
    }
  },

  AddCategory: async (name, imagepath) => {
    try {
      let imageUrl = null;
      if (imagepath) {
        const uploadResult = await uploadTheImage(imagepath);
        imageUrl = uploadResult?.secure_url;
        fs.unlinkSync(imagepath);
      }
      const category = await CategoryModel.create({ name, image: imageUrl });
      if (!category) {
        throw new Error("error in create category");
      }

      return category;
    } catch (error) {
      console.log(error);
      throw new Error("error in AddCategory " + error?.message);
    }
  },

  AddProduct: async (data, filespaths) => {
    try {
      const {
        productname,
        category,
        description,
        quantity,
        howToUse,
        highlights,
        price,
      } = data;

      if (
        !productname ||
        !category ||
        !description ||
        quantity === undefined ||
        !howToUse ||
        !highlights ||
        price === undefined
      ) {
        throw new Error("All fields are required");
      }

      if (!filespaths || filespaths.length === 0) {
        throw new Error("Images are required");
      }

      const uploadImages = [];

      for (const file of filespaths) {
        const upload = await uploadTheImage(file.path);
        uploadImages.push(upload.secure_url);
        fs.unlinkSync(file.path);
      }

      const product = await ProductModel.create({
        productname,
        category,
        description,
        quantity,
        images: uploadImages,
        howToUse,
        highlights,
        price,
      });

      return product;
    } catch (error) {
      console.error("AddProduct Error:", error.message);
      throw new Error(error.message);
    }
  },

  UpdateProduct: async (productId, data, filespaths) => {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      const {
        productname,
        category,
        description,
        quantity,
        howToUse,
        highlights,
        price,
      } = data;
      if (
        !productname ||
        !category ||
        !description ||
        quantity === undefined ||
        !howToUse ||
        !highlights ||
        price === undefined
      ) {
        throw new Error("All fields are required");
      }
      let updatedImages = product.images;

      if (filespaths && filespaths.length > 0) {
        updatedImages = [];

        for (const file of filespaths) {
          const upload = await uploadTheImage(file.path);
          updatedImages.push(upload.secure_url);
          fs.unlinkSync(file.path);
        }
      }
      product.productname = productname;
      product.category = category;
      product.description = description;
      product.quantity = quantity;
      product.howToUse = howToUse;
      product.highlights = highlights;
      product.price = price;
      product.images = updatedImages;

      await product.save();
      return product;
    } catch (error) {
      throw new Error("error in update product");
    }
  },

  DeleteProduct : async (ProductId) => {
    try {
      if(!ProductId){
        throw new Error("product id id requerd")
      }

      const product = await ProductModel.findByIdAndDelete(ProductId)

      if(!product){
        throw new Error("product not found")
      }

      return product
    } catch (error) {
      throw new Error("error in delete product")
    }
  }
};

export default AdminService;
