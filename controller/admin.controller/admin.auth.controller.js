import AdminModel from "../../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminService from "../../service/admin.service/admin.service.js";
const AdminAuth = {
  RegisterAdmin: async (req, res) => {
    try {
      const { name, email, password, contact } = req.body;
      if (!name || !email || !password || !contact) {
        return res.status(400).json({ error: "all fealds are requerd" });
      }

      const existEmail = await AdminModel.findOne({ email })
        .lean()
        .select("email");
      if (existEmail) {
        return res.status(400).json({ error: "email alrady exist" });
      }

      const existContact = await AdminModel.findOne({ contact })
        .lean()
        .select("contact");
      if (existContact) {
        return res.status(400).json({ error: "contact alrady exist" });
      }

      const hashPass = await bcrypt.hash(password, 10);

      const admin = await AdminModel.create({
        name,
        email,
        password: hashPass,
        contact,
      });

      const token = await jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        admin,
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  LoginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "all fealds are requerd" });
      }

      const admin = await AdminService.FindAdminByEmail(email);

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = await jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ message: "login sucsessfully", admin: admin, token: token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error?.message });
    }
  },
};

export default AdminAuth;
