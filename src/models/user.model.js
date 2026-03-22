import {Schema , model} from "mongoose"

const userSchema = new Schema({
    username : {
        type : String,
        required : [true , "username will be required"],
        minlength : [3 , "min length on this field 3 latter"]
    },
    email : {
        type : String || undefined,
        required : [true , "email will be required"],
        unique : [true , "this field also unique so please"],
        trim : true,
        lowercase : true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
        
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
    },
    resetToken : {
        type : String,
        default : undefined
    },
    resetTokenExpires : {
        type : Date,
        default : undefined
    },
    isEmailVerified : {
        type : Boolean,
        default : false
    }
   },{timestamps : true})

 const User = model("User" , userSchema)

 export default User