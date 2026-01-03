import express from "express";
import user_Messages_Controller from "../../controller/user.controller/user.messages.controller.js";

const user_Messages_Router = express.Router();

user_Messages_Router.post('/post-messages', user_Messages_Controller.postMessages)

export default user_Messages_Router;