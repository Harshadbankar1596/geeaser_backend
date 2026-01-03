import express from "express"
import UserAuth from "../../controller/user.controller/user.auth.controller.js"

const router = express.Router()

router.post("/login-user" , UserAuth.AuthUser)
router.post("/logout-user" , UserAuth.LogoutUser)

export default router