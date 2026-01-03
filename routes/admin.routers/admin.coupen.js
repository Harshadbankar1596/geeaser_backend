import express from "express";
import admin_Coupen_Controller from "../../controller/admin.controller/admin.coupen.controller.js";

const admin_Coupen_Router = express.Router();

admin_Coupen_Router.post('/add/coupen', admin_Coupen_Controller.addCoupens);
admin_Coupen_Router.get('/get/coupens', admin_Coupen_Controller.getCoupens);
admin_Coupen_Router.delete('/delete/coupen/:coupen_id', admin_Coupen_Controller.deleteCoupen);
admin_Coupen_Router.patch('/update/coupen/:coupen_id', admin_Coupen_Controller.updateCoupen);


export default admin_Coupen_Router