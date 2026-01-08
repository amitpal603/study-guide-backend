import { Router } from "express"
import {Schema , model} from "mongoose"

const semesterSchema = new Schema({
    semester : {
        type : Number
    },
    course_id : {
        type : Schema.Types.ObjectId,
        ref : "Course"
    }
} , {timestamps : true})

export const Semester = model("Semester" , semesterSchema)