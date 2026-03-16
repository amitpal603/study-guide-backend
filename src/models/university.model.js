import {Schema , model} from "mongoose"

const universitySchema = new Schema({
    university_name : {
        type : String,
        required : true
    }
} , {timestamps : true})

const University = model("University" , universitySchema)

export default University