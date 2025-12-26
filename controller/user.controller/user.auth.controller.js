import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import UserService from "../../service/user.service/user.service.js";
const UserAuth = {
  RegisterUser: async (req, res) => {
    try {
      const { name, email, password, contact } = req.body;
      if (!name || !email || !password || !contact) {
        return res.status(400).json({ error: "all fealds are requerd" });
      }

      const existEmail = await UserModel.findOne({ email })
        .lean()
        .select("email");
      if (existEmail) {
        return res.status(400).json({ error: "email alrady exist" });
      }

      const existContact = await UserModel.findOne({ contact })
        .lean()
        .select("contact");
      if (existContact) {
        return res.status(400).json({ error: "contact alrady exist" });
      }

      const hashPass = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        name,
        email,
        password: hashPass,
        contact,
      });

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("user-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  LoginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "all fealds are requerd" });
      }

      const user = await UserService.FindUserByEmail(email);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("user-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ message: "login sucsessfully", user: user, token: token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error?.message });
    }
  },
};

export default UserAuth;