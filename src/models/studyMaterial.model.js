import {Schema , model} from "mongoose"

const studyMaterial = new Schema({
    title : {
        type : String,
        required :  true
    },
    material_type : {
        type : String
    },
    content_link : {
        type :  String,
        required : true
    },
    subject_id : {
        type :  Schema.Types.ObjectId,
        ref : "Subject"
    },
    uploadedByMaterial : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
} , {timestamps : true})

const Study = model("Study" , studyMaterial)

export default Study