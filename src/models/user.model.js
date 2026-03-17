import {Schema , model} from "mongoose"

const userSchema = new Schema({
    username : {
        type : String,
        required : [true , "username will be required"],
        minlength : [3 , "min length on this field 3 latter"]
    },
    email : {
        type : String,
        required : [true , "email will be required"],
        unique : [true , "this field also unique so please"],
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required :[true , "Password will be required"]
    },
    role : {
        type : String,
        enum : ["USER" , "ADMIN"],
        default : "USER"
    },
    university_id : {
        type : Schema.Types.ObjectId,
        ref : "University"
    },
    course_id : {
        type : Schema.Types.ObjectId,
        ref : "Course"
    },
    semester_id : {
        type : Schema.Types.ObjectId,
        ref : "Semester"
    },
    refreshToken : {
        type : String || undefined
    }
   },{timestamps : true})

 const User = model("User" , userSchema)

 export default User