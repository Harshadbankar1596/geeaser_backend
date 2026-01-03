import express from "express";
import user_Product_Controller from "../../controller/user.controller/user.product.controller.js";

const user_Product_Router = express.Router();

user_Product_Router.get("/get-products", user_Product_Controller.getAllProducts);
user_Product_Router.get("/get-categories", user_Product_Controller.getCategories);
user_Product_Router.get("/get-coupens", user_Product_Controller.getAllCoupens);

export default user_Product_Router;
