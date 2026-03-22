import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import { limiter } from "./lib/rate-limit.js"
import { connectDB } from "./config/db.js"
import { corsOptions } from "./lib/corsConfigers.js"
import cors from "cors"
import authRoutes from "./routers/authUser.routes.js"
import cookieParser from "cookie-parser"
import adminRoutes from "./routers/authAdmin.routes.js"
import getRoutes from "./routers/get.routes.js"

dotenv.config()
await connectDB()

const app = express()

app.use(helmet())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json({limit : "20mb"}))
app.use(express.urlencoded({extended : true , limit : "20mb"}))
app.use(limiter)

//! routes for users

app.use("/api/auth/user" , authRoutes)

//? routes for admin

app.use("/api/auth/admin" , adminRoutes)

app.use("/api" , getRoutes)

app.get("/health" , (req , res) => {
    res.json({
        status : "ok"
    })
})

const PORT = process.env.PORT || 4000
app.listen(PORT , () => {
    console.log(`server running http://localhost:${PORT}`)
})

