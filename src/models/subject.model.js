import {Schema , model} from "mongoose"

const subjectSchema = new Schema({
    subject_name : {
        type : String
    },
    subject_code : {
        type : Number
    },
    semester_id : {
        type : Schema.Types.ObjectId,
        ref : "Semester"
    },
    course_id : {
        type : Schema.Types.ObjectId,
        ref : "Course"
    }
} , {timestamps : true})

const Subject = model("Subject" , subjectSchema)

export default Subject