import { Router } from "express";
import { getCourse, getSemester, getSubject, getUniversity } from "../controllers/getUni.controller.js";
import { authUser } from "../middleware/authUserMiddleware.js";
import { authAdmin } from "../middleware/authAdmin.js";

const router = Router();

// ✅ get all universities
router.get("/university", authUser, authAdmin, getUniversity);

// ✅ get courses (with optional query)
router.get("/course/:universityId", authUser, authAdmin, getCourse);

router.get("/semester/:courseId" , authUser , authAdmin , getSemester)

router.get("/subject" , authUser , authAdmin , getSubject)

export default router;