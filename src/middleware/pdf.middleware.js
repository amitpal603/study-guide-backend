import multer from "multer";
import path from "path";
import fs from "fs";

//  absolute upload path
const uploadPath = path.join(process.cwd(), "upload");

//  folder auto-create (VERY IMPORTANT 🔥)
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

//  storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

//  file filter
const checkFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

//  multer export
const upload = multer({
  storage: storage,
  fileFilter: checkFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export default upload;