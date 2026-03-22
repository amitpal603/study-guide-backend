import Course from "../models/course.model.js"
import Semester from "../models/semester.model.js"
import Subject from "../models/subject.model.js"
import University  from "../models/university.model.js"

export const getUniversity = async (req , res) => {
     try {
        const university = await University.find({})

        return res.status(200).json({
            university
        })
     } catch (error) {
        return res.status(500).json({
            message : "Internal server error University controller"
        })
     }
}

export const getCourse = async (req, res) => {
  try {
    const { universityId } = req.params;

    const courses = await Course.find({
      university_id: universityId   // ✅ correct field
    }).populate("university_id", "name"); // ✅ correct populate

   return  res.status(200).json({
      success: true,
      courses
    });

  } catch (error) {
   return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSemester = async (req , res) => {
    try {
        const {courseId} = req.params

        const semester = await Semester.find({course_id : courseId}).populate("course_id" , "semester")

    return  res.status(200).json({
      success: true,
      semester
    });
    } catch (error) {
        return res.status(500).json({
      success: false,
      message: error.message
    });
    }
}

export const getSubject = async (req, res) => {
  try {
    const { semesterId, courseId } = req.params;

    const subjects = await Subject.find({
      course_id: courseId,
      semester_id: semesterId
    })
    .populate("course", "courseName")       // optional
    .populate("semester", "semesterNumber"); // optional

    return res.status(200).json({
      success: true,
      data: subjects
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};