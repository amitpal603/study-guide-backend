import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import { limiter } from "./lib/rate-limit.js"


dotenv.config()

const app = express()
app.use(helmet())
app.use(express.json({limit : "10mb"}))
app.use(express.urlencoded({extended : true , limit : "10mb"}))
app.use(limiter)


app.get("/health" , (req , res) => {
    res.json({
        status : "ok"
    })
})

const PORT = process.env.PORT || 4000
app.listen(PORT , () => {
    console.log(`server running http://localhost:${PORT}`)
})

