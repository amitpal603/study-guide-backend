import {Router} from "express"
import { userLogin, userLogout, UserRegister } from "../controllers/authUser.js"
import { validate } from "../middleware/validateFields.js"
const router = Router()

//! user auth routes

router.post("/register"  , UserRegister)
router.post("/login" , userLogin)
router.post("/logout" , userLogout)

export default router 
