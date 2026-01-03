import express from "express";
import user_Order_Controller from "../../controller/user.controller/user.order.controller.js";

const user_Order_Routes = express.Router();

user_Order_Routes.post('/post-order', user_Order_Controller.putOrder)
user_Order_Routes.post('/verify', user_Order_Controller.verifyOrder)

export default user_Order_Routes;