import {Router} from "express"
import { userLogin, UserRegister } from "../controllers/authUser.js"
import { validate } from "../middleware/validateFields.js"
const router = Router()

//! user auth routes

router.post("/register"  , UserRegister)
router.post("/login" , userLogin)

export default router 
