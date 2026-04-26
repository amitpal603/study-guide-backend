import Subject from "../models/subject.model.js"
import Study from "../models/studyMaterial.model.js"
import University from "../models/university.model.js";
import Course from "../models/course.model.js";
import Semester from "../models/semester.model.js";
import { uploadCloudinaryPDF } from "../Helper/uploadCloudinary.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

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

export const getPdf = async (req, res) => {
  try {
    const {university , course , semester, subject } = req.query;

    const data = await Study.find()
      .populate({
        path: "subject",
        match: subject ? { subjectName: subject } : {},
        populate: {
          path: "semester_id",
          match: semester ? { semester: Number(semester) } : {},
          populate: {
            path: "course_id",
            match: course ? { course_name: course } : {},
            populate: {
              path: "university_id",
              match: university ? { university_name: university } : {}
            }
          }
        }
      });

    // ❗ Remove unmatched (null populated)
    const filteredData = data.filter(item => item.subject !== null);

    return res.status(200).json({ data: filteredData });

  } catch (error) {
    return res.status(500).json({
      message: `Internal server error ${error.message}`
    });
  }
};

export const deletePdf = async (req, res) => {
  const { pdfId } = req.params;
  const {id} = req.userInfo;

  try {
    if (!mongoose.Types.ObjectId.isValid(pdfId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF ID",
      });
    }
    const pdf = await Study.findById(pdfId);
    const subjectId = pdf.subject

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "Pdf not found",
      });
    }
    
    if (pdf.uploadedBy.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this pdf",
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(pdf.publicId , {
              resource_type: "raw"
    });

    // Delete from MongoDB
    await Study.findByIdAndDelete(pdfId);
    if(!subjectId) {
      return res.status(403).json({
        message : "subject id not provided"
      })
    }
     const sub = await Subject.findByIdAndDelete(subjectId)
     const semesterId = sub.semester_id

     if(!semesterId) {
      return res.status(403).json({
        message : "semester id not provided"
      })
    }
    const course = await Semester.findByIdAndDelete(semesterId)
    const courseId = course.course_id
    if(!courseId) {
      return res.status(403).json({
        message : "course id not provided"
      })
    }
    const uni = await Course.findByIdAndDelete(courseId)
    const universityId = uni.university_id
    if(!universityId) {
      return res.status(403).json({
        message : "university id not provided"
      })
    }
    await University.findByIdAndDelete(universityId)
    return res.status(200).json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (error) {
    console.error("Delete PDF Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const userGetPdf = async (req, res) => {
  const { subjectName } = req.query;

  const normallySubject = subjectName.toLowerCase()

  try {
    if (!normallySubject) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    // Step 1: Find subject document
    const subjectData = await Subject.findOne({ subjectName: normallySubject });

    if (!subjectData) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // Step 2: Fetch related content
    const relatedData = await Study.find({ subject: subjectData._id });

    return res.status(200).json({
      data: relatedData,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Internal server error: ${error.message}`,
    });
  }
};