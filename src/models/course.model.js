import {Schema , model} from "mongoose"

const courseSchema = new Schema({
    course_name : {
        type : String,
        required : true
    },
    university_id : {
        type : Schema.Types.ObjectId,
        ref : "University",
    }
} , {timestamps : true})

export const Course = model("Course" , courseSchema)