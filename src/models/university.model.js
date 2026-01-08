import {Schema , model} from "mongoose"

const universitySchema = new Schema({
    university_name : {
        type : String,
        required : true
    }
} , {timestamps : true})

export const University = model("University" , universitySchema)