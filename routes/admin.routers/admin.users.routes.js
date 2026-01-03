import express from "express";
import admin_User_Controller from "../../controller/admin.controller/admin.users.controller.js";

const admin_User_Router = express.Router();

admin_User_Router.get('/get/all/users', admin_User_Controller.GetAllUsers)



export default admin_User_Router;