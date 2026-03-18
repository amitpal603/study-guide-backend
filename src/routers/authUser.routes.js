import {Router} from "express"
import { forgetPassword, userLogin, userLogout, UserRegister, resetPassword} from "../controllers/authUser.js"
import { validate } from "../middleware/validateFields.js"
const router = Router()

//! user auth routes

router.post("/register"  , UserRegister)
router.post("/login" , userLogin)
router.post("/logout" , userLogout)
router.post("/forget-password" , forgetPassword)
router.post("/reset-password" , resetPassword )

export default router 
