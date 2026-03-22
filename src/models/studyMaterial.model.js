import { Schema, model } from "mongoose";

const studyMaterial = new Schema({
  title: {
    type: String,
    required: true
  },

  materialType: {
    type: String
  },

  fileUrl: {
    type: String,
    required: true
  },

  publicId: {
    type: String
  },

  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

const Study = model("Study", studyMaterial);

export default Study;