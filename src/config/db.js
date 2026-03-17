import mongoose from "mongoose";

 export const connectDB =  async() => {
 try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Server connected successfully....");
 } catch (error) {
    console.log(error.message)
    process.exit(1);
 }
}