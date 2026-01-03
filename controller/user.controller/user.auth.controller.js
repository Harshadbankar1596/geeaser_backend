import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserService from "../../service/user.service/user.service.js";
const UserAuth = {
  AuthUser: async (req, res) => {
    try {
      const { contact, name } = req.body;

      if (!contact) {
        return res.status(400).json({ error: "All fields are required" });
      }

      let user = await UserModel.findOne({ contact });
      let isNewUser = false;

      if (!user) {
        user = await UserModel.create({ contact, name });
        isNewUser = true;
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      return res.status(200).json({
        success: true,
        message: isNewUser
          ? "User registered successfully"
          : "Login successfully",
        user,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  LogoutUser: async (req, res) => {
    try {
      res.clearCookie("token");

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

export default UserAuth;
