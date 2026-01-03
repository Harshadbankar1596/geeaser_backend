import express from "express"
import UserAuth from "../../controller/user.controller/user.auth.controller.js"

const router = express.Router()

router.post("/auth" , UserAuth.AuthUser)
router.get("/logout-user" , UserAuth.LogoutUser)

export default router