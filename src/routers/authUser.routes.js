import {Router} from "express"
import { forgetPassword, userLogin, userLogout, UserRegister, resetPassword} from "../controllers/authUser.controller.js"
import { validate } from "../middleware/validateFields.js"
import { authUser } from "../middleware/authUserMiddleware.js"
import { authAdmin } from "../middleware/authAdmin.js"
import { getPdf } from "../controllers/pdf.controller.js"
const router = Router()

//! user auth routes

router.post("/register"  , validate , UserRegister)
router.post("/login" , userLogin)
router.post("/logout" , userLogout)
router.post("/forget-password" , forgetPassword)
router.post("/reset-password/:token" , resetPassword )
router.get("/get/pdf" ,authUser , authAdmin, getPdf)

export default router 
