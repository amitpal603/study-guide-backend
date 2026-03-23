import {Router} from "express"
import { deletePdf, uploadPdfToDatabase } from "../controllers/pdf.controller.js"
import { authUser } from "../middleware/authUserMiddleware.js"
import { authAdmin } from "../middleware/authAdmin.js"
import pdfMiddleware from "../middleware/pdf.middleware.js"
const router = Router()

router.post("/upload-pdf" , authUser , authAdmin , pdfMiddleware.single("pdf"), uploadPdfToDatabase)
router.delete("/delete-pdf/:pdfId" , authUser , authAdmin , deletePdf)

export default router