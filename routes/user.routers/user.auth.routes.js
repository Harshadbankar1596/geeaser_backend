import express from "express"
import UserAuth from "../../controller/user.controller/user.auth.controller.js"

const router = express.Router()

router.post("/register-user" , UserAuth.RegisterUser)
router.post("/login-user" , UserAuth.LoginUser)

export default router