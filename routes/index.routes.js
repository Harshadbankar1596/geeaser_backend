import express from "express"
import UserAuthRouter from "./user.routers/user.auth.routes.js"
import AdminAuthRouter from "./admin.routers/admin.auth.routes.js"
import AdminRouter from "./admin.routers/admin.routes.js"
const router = express.Router()

// User Auth Routes
router.use("/user/auth" , UserAuthRouter)

// admin Auth Routes
router.use("/admin/auth" , AdminAuthRouter)

// admin Routes
router.use("/admin" , AdminRouter)


export default router