import {Schema , model} from "mongoose"

const userSchema = new Schema({
    username : {
        type: String || undefined,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String || undefined,
        required : true,
        trim : true,
        lowercase : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ["USER" , "ADMIN"],
        default : "USER"
    },
    phone : {
        type : String || undefined,
        trim : true,
        unique : true

    },
    university_id : {
        type : Schema.Types.ObjectId,
        ref :  "University"
    },
    course_id : {
        type : Schema.Types.ObjectId,
        ref : "Course"
    },
    semester_id : {
        type : Schema.Types.ObjectId,
        ref :  "Semester"
    },
   refreshToken : {
            type : String
    } ,},{timestamps : true})

 const User = model("User" , userSchema)

 export default User