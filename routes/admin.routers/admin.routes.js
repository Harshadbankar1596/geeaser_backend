import express from "express"
import AdminController from "../../controller/admin.controller/admin.controller.js"
import upload from "../../middleware/multer.js"
const router = express.Router()

router.post("/add-category" ,upload.single("image"), AdminController.AddCategory)
router.post("/add-product" , upload.array("images") , AdminController.AddProduct)
router.put("/update-product" , upload.array("images") , AdminController.Updateproduct)
router.delete("/delete-product/:productId" , AdminController.DeleteProduct)

export default router