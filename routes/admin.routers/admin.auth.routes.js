import express from "express"
import AdminAuth from "../../controller/admin.controller/admin.auth.controller.js"

const router = express.Router()

router.post("/register-admin" , AdminAuth.RegisterAdmin)
router.post("/login-admin" , AdminAuth.LoginAdmin)

export default router