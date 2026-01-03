import express from "express";
import UserAuthRouter from "./user.routers/user.auth.routes.js";
import AdminAuthRouter from "./admin.routers/admin.auth.routes.js";
import AdminRouter from "./admin.routers/admin.routes.js";
import authMiddleware from "../middleware/auth.js";
import user_Product_Router from "./user.routers/user.products.routes.js";
import user_Cart_Routes from "./user.routers/user.cart.routes.js";
import user_Address_Router from "./user.routers/user.address.routes.js";
import user_Order_Routes from "./user.routers/user.order.routes.js";
import admin_Coupen_Router from "./admin.routers/admin.coupen.js";
import admin_User_Router from "./admin.routers/admin.users.routes.js";
import admin_Order_Router from "./admin.routers/admin.order.routes.js";
import user_Messages_Controller from "../controller/user.controller/user.messages.controller.js";
import user_Messages_Router from "./user.routers/user.messages.routes.js";
import admin_Messages_Router from "./admin.routers/admin.messages.routes.js";
const router = express.Router();

// User Auth Routes
router.use("/user/auth", UserAuthRouter);
router.use("/user/products", user_Product_Router);
router.use("/user/products/cart", authMiddleware, user_Cart_Routes);
router.use("/user/address", authMiddleware, user_Address_Router);
router.use("/user/order", authMiddleware, user_Order_Routes);

// admin Routes
router.use("/admin/auth", AdminAuthRouter);
router.use("/admin/product", authMiddleware, AdminRouter);
router.use("/admin/coupen", authMiddleware, admin_Coupen_Router);
router.use("/admin/users", authMiddleware, admin_User_Router);
router.use("/admin/orders", authMiddleware, admin_Order_Router);
router.use("/admin/messages", authMiddleware, admin_Messages_Router);


// Not logged In users
router.use("/users", user_Messages_Router);

export default router;
