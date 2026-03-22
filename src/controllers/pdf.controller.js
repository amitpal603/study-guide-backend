import Subject from "../models/subject.model.js"
import Study from "../models/studyMaterial.model.js"
import University from "../models/university.model.js";
import Course from "../models/course.model.js";
import Semester from "../models/semester.model.js";
import { uploadCloudinaryPDF } from "../Helper/uploadCloudinary.js";

export const uploadPdfToDatabase = async (req, res) => {
  try {
    const {university , course, semester , title, materialType, subjectName, subjectCode } = req.body;

    // ? file check
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required"
      });
    }

    const uni = await new University({university_name : university}).save()

    const cou =  await new Course(
      {
        course_name : course,
        university_id : uni._id
      }
    ).save()

    const sem = await new Semester(
      {
        semester : Number(semester),
        course_id : cou._id
      }
    ).save()

    const subject = await new Subject(
      {
        subjectName,
        subjectCode,
        semester_id : sem._id,
        course_id : cou._id
      }
    ).save()
    
  
    //  upload pdf
    const { url, publicId } = await uploadCloudinaryPDF(req.file.path);

    //  save study
    const study = await Study.create({
      title,
      materialType,
      fileUrl: url,
      publicId,
      subject: subject._id,
      uploadedBy: req.userInfo.id
    });

    return res.status(201).json({
      success: true,
      message: "PDF uploaded successfully",
      data: study
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error.message} pdf upload controller`
    });
  }
};

export const getPdf = async (req , res) => {
  try {
    const data = await Study.find({})

    return res.status(200).json({
      data
    })
  } catch (error) {
    return res.status(500).json({
      message : "Internal server error"
    })
  }
}