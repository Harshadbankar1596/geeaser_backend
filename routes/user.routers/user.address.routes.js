import express from "express";
import user_Address_Controller from "../../controller/user.controller/user.address.controller.js";

const user_Address_Router = express.Router();

user_Address_Router.post('/add-address', user_Address_Controller.AddAddress);
user_Address_Router.delete('/delete-address/:address_id', user_Address_Controller.DeleteAddress);
user_Address_Router.get('/get/my/address', user_Address_Controller.getMyAddress);


export default user_Address_Router;