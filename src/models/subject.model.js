import {Schema , model} from "mongoose"

const subjectSchema = new Schema({
    subjectName : {
        type : String
    },
    subjectCode : {
        type : String
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