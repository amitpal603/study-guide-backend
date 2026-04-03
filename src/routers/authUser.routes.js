import {Router} from "express"
import { forgetPassword, userLogin, userLogout, UserRegister, resetPassword, getAllUser, deleteUser, verifyEmail} from "../controllers/authUser.controller.js"
import { validate } from "../middleware/validateFields.js"
import { authUser } from "../middleware/authUserMiddleware.js"
import { authAdmin } from "../middleware/authAdmin.js"
import { getPdf, userGetPdf } from "../controllers/pdf.controller.js"
const router = Router()

//! user auth routes
/**
 * @route POST /api/auth/user/register
 * @desc Register a new user
 * @access Public (no authentication required)
 */
router.post("/register"  , UserRegister)
/**
 * @route POST /api/auth/user/login
 * @desc Authenticate user and return a token
 * @access Public (no authentication required)
 */
router.post("/login" , userLogin)
/**
 * @route POST /api/auth/user/logout
 * @desc Logout the user by invalidating their token
 * @access Private (requires authentication)
 */
router.post("/logout" , userLogout)
/**
 * @route POST /api/auth/user/forget-password
 * @desc Send a password reset email to the user
 * @access Public (no authentication required)
 */
router.post("/forget-password" , forgetPassword)
/**
 * @route POST /api/auth/user/reset-password/:token
 * @desc Reset user's password using the token sent to their email
 * @access Public (no authentication required)
 */
router.post("/reset-password/:token" , resetPassword )
/**
 * @route GET /api/auth/user/get/pdf?university=mgkvp&course=bca&semester=1&subject=maths
 * @desc Get PDF data based on university, course, semester, and subject
 * @access Private (requires authentication and admin role)
 */
router.get("/get/pdf" ,authUser , authAdmin, getPdf)
/**
 * @route GET /api/auth/user/getAllUser
 * @desc Get a list of all users (admin only)
 * @access Private (requires authentication and admin role)
 */
router.get("/getAllUser" , authUser , authAdmin , getAllUser)
/**
 * @route DELETE /api/auth/user/delete/:id
 * @desc Delete a user by ID (admin only)
 * @access Private (requires authentication and admin role)
 */
router.delete("/delete/:id" , authUser , authAdmin , deleteUser)
/**
 * @route POST /api/auth/user/verify-email
 * @desc Verify user's email address using the token sent to their email
 * @access Public (no authentication required)
 */
router.post("/verify-email" , verifyEmail)
/**
 * @route GET /api/auth/user/get-data?university=mgkvp&course=bca&semester=1&subject=maths
 * @desc Get PDF data based on university, course, semester, and subject
 * @access Private (requires authentication)
 */
router.get("/get-data" , authUser , userGetPdf)

export default router
