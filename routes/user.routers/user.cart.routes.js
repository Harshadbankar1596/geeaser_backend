import express from "express";
import user_Cart_Controller from "../../controller/user.controller/user.cart.controller.js";
const user_Cart_Routes = express.Router();

user_Cart_Routes.post('/add/to/cart/:product_id', user_Cart_Controller.addToCart)
user_Cart_Routes.get('/get/cart', user_Cart_Controller.getCartDetails)
user_Cart_Routes.delete('/remove/product/:id', user_Cart_Controller.removeProduct)

export default user_Cart_Routes;

