import {Router} from "express"
import { UserRegister } from "../controllers/authUser.js"
import { validate } from "../middleware/validateFields.js"
const router = Router()

//! user auth routes

router.post("/register" ,validate , UserRegister)

export default router 
