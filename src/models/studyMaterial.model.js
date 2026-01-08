import {Schema , model} from "mongoose"

const studyMaterial = new Schema({
    title : {
        type : String,
        required :  true
    },
    material_type : {
        type : String
    },
    material_path : {
        type :  String,
        required : true
    },
    subject_id : {
        type :  Schema.Types.ObjectId,
        ref : "Subject"
    },
    uploadedByMaterial : {
        type : Schema.Types.ObjectId,
        ref : "Admin"
    }
} , {timestamps : true})