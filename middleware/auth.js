import jwt from "jsonwebtoken";
import AdminModel from "../models/admin.model.js";
import UserModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    console.log("token", token);
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;

    if (!id) {
      return res.status(400).json({ message: "Id not found" });
    }

    const admin = await AdminModel.findById(id);
    if (admin) {
      req.admin = admin;
      return next();
    }
    const user = await UserModel.findById(id);
    if (user) {
      req.user = user;
      return next();
    }
    return res.status(401).json({ message: "User not found" });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default authMiddleware;
