import express from "express";
import admin_Order_Controller from "../../controller/admin.controller/admin.orders.controller.js";

const admin_Order_Router = express.Router();

admin_Order_Router.get('/get/all/orders', admin_Order_Controller.getAllOrders)
admin_Order_Router.patch('/make/cod/completed/:order_id', admin_Order_Controller.makeCodCompleted)

export default admin_Order_Router;