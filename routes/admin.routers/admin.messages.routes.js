import express from "express";
import admin_Messages_Controller from "../../controller/admin.controller/admin.messages.controller.js";

const admin_Messages_Router = express.Router();

admin_Messages_Router.get('/get/messages', admin_Messages_Controller.getMessages)

export default admin_Messages_Router;