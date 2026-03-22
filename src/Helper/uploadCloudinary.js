import cloudinary from "../config/cloudinary.js";
import fs from "fs"


export const uploadCloudinaryPDF = async (filepath) => {
  try {
    if (!filepath) {
      throw new Error("File path is missing");
    }

    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto", // REQUIRED for PDFs
      folder: "pdfs",
    });
     fs.unlinkSync(filepath)
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };

  } catch (error) {
    console.error("Error while uploading to Cloudinary:", error.message);
    throw new Error(error.message || "Cloudinary upload failed");
  }
};


