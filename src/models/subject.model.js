import {Schema , model} from "mongoose"

const subjectSchema = new Schema({
    subject_name : {
        type : String
    },
    subject_code : {
        type : Number
    }
} , {timestamps : true})

export const Subject = model("Subject" , subjectSchema)