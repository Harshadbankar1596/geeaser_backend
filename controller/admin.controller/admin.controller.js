import AdminService from "../../service/admin.service/admin.service.js";

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

  AddProduct: async (req, res) => {
    try {
      if (!req.files) {
        return res.status(400).json({ error: "images are requerd" });
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
      const updatedproduct = await AdminService.UpdateProduct(
        req.body.productId,
        req.body,
        req.files
      );

      res
        .status(200)
        .json({ message: "product updated", UpdatedProduct: updatedproduct });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error?.message });
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
};

export default AdminController;