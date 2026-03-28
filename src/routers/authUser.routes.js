import {Router} from "express"
import { forgetPassword, userLogin, userLogout, UserRegister, resetPassword, getAllUser, deleteUser, verifyEmail} from "../controllers/authUser.controller.js"
import { validate } from "../middleware/validateFields.js"
import { authUser } from "../middleware/authUserMiddleware.js"
import { authAdmin } from "../middleware/authAdmin.js"
import { getPdf } from "../controllers/pdf.controller.js"
const router = Router()

//! user auth routes

router.post("/register"  , UserRegister)
router.post("/login" , userLogin)
router.post("/logout" , userLogout)
router.post("/forget-password" , forgetPassword)
router.post("/reset-password/:token" , resetPassword )
router.get("/get/pdf" ,authUser , authAdmin, getPdf)
router.get("/getAllUser" , authUser , authAdmin , getAllUser)
router.delete("/delete/:id" , authUser , authAdmin , deleteUser)
router.post("/verify-email" , verifyEmail)

export default router
