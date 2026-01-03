import express from "express"
import AdminController from "../../controller/admin.controller/admin.controller.js"
import upload from "../../middleware/multer.js"
const router = express.Router()

router.post("/add-category" ,upload.single("image"), AdminController.AddCategory)
router.delete("/delete-category/:cat_id" ,upload.single("image"), AdminController.deleteCategory)
router.post("/add-product" , upload.array("images") , AdminController.AddProduct)
router.patch("/update-product/:product_id" , upload.array("images") , AdminController.Updateproduct)
router.delete("/delete-product/:productId" , AdminController.DeleteProduct)
router.get("/get-categories" , AdminController.getCategories)
router.get("/get-products" , AdminController.getProducts)

export default router