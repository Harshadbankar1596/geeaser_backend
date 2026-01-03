import CoupenModel from "../../models/coupen.model.js";

const admin_Coupen_Controller = {
  async addCoupens(req, res) {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin is not valid" });
      }
      const { coupen_Code, offer } = req.body;
      if (!coupen_Code || !offer) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const coupenNew = new CoupenModel({
        coupen_Code,
        offer,
      });
      await coupenNew.save();
      return res.status(200).json({ message: "Coupens", data: coupenNew });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getCoupens(req, res) {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin is not valid" });
      }
      const coupens = await CoupenModel.find({});
      return res.status(200).json({ message: "Success", data: coupens });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deleteCoupen(req, res) {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin is not valid" });
      }
      const { coupen_id } = req.params;
      if (!coupen_id) {
        return res.status(400).json({ message: "Coupen id is required" });
      }
      const isCoupenExists = await CoupenModel.findByIdAndDelete(coupen_id);
      if (!isCoupenExists) {
        return res.status(400).json({ message: "" });
      }
      return res.status(200).json({ message: "Coupen Delete Successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async updateCoupen(req, res) {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(400).json({ message: "Admin is not valid" });
      }
      const { coupen_id } = req.params;
      const { coupen_Code, offer } = req.body;
      if (!coupen_id) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const updateTheData = await CoupenModel.findByIdAndUpdate(
        coupen_id,
        {
          coupen_Code,
          offer,
        },
        { new: true }
      );

      return res.status(200).json({ message: "Success", data: updateTheData });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default admin_Coupen_Controller;
