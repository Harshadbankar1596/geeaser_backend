import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import IndexRoute from "./routes/index.routes.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin : ["http://localhost:5173", "https://sunrise-r5tz.onrender.com" , "https://sunsirse-admin-fd.onrender.com"],
    credentials : true
}))
app.use(cookieParser())

app.use("/api" , IndexRoute)

export default app