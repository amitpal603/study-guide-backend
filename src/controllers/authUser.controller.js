import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
import University from "../models/university.model.js"
import Course from "../models/course.model.js"
import Semester from "../models/semester.model.js"
import crypto from "crypto"
import { sendEmail } from "../lib/email.js"
import {  sendMail1 } from "../services/email.service.js"
import { getOtpHtml ,generateOTP} from "../lib/otpGenerate.js"
import Otp from "../models/otp.model.js"

export const UserRegister = async (req, res) => {
  try {
    console.log("✅ Register API hit");

    const {
      username,
      email,
      password,
      university,
      course,
      semester,
      role,
    } = req.body;

    // 🔹 Check existing user
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // 🔹 Hash password
    const hashPassword = await argon2.hash(password);

    let newUser;

    
    // ! ADMIN REGISTER
   
    if (role === "ADMIN") {
      newUser = await User.create({
        username,
        email,
        password: hashPassword,
        role: "ADMIN",
        isEmailVerified: false, // ✅ admin field
      });
    } 
    
    // ! USER REGISTER
    
    else {
      let uni = await University.findOne({ university_name: university });
      if (!uni) {
        uni = await University.create({ university_name: university });
      }

      let cou = await Course.findOne({
        course_name: course,
        university_id: uni._id,
      });

      if (!cou) {
        cou = await Course.create({
          course_name: course,
          university_id: uni._id,
        });
      }

      let sem = await Semester.findOne({
        semester: semester,
        course_id: cou._id,
      });

      if (!sem) {
        sem = await Semester.create({
          semester: semester,
          course_id: cou._id,
        });
      }

      newUser = await User.create({
        username,
        email,
        password: hashPassword,
        role: role || "USER",
        university_id: uni._id,
        course_id: cou._id,
        semester_id: sem._id,
        isEmailVerified: false, // ✅ SAME field use karo
      });
    }

    
    const otp = generateOTP();

    const otpHash = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    await Otp.create({
      email,
      user: newUser._id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // 🔹 Send Email
     await sendMail1(email, otp);

    

    return res.status(201).json({
      message: `${role === "ADMIN" ? "Admin" : "User"} registered. OTP sent`,
      userId: newUser._id,
    });

  } catch (error) {
    console.error("❌ Register Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const userLogin = async (req, res) => {

  const { email, password } = req.body

  try {

    // Validate input
    if (!email && !password) {
      return res.status(400).json({
        message: "Email  and Password are required"
      })
    }

    // Find user by email or phone
    const user = await User.findOne({ email})

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if(!user.isEmailVerified) {
      return res.status(403).json({
        message : "Please verify your email before login"
      })
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password)

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password"
      })
    }

    // Token payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    }

    const token = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    )

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    }

    const data = {
      token,
      role : user.role
    }

    return res.status(200).cookie("token" , token , options).json({
      message: "Login successfully",
      data
    })

  } catch (error) {

    console.error("Login Error:", error)

    return res.status(500).json({
      message: "Internal server error in login controller"
    })
  }
}

export const userLogout = async (req, res) => {
  return res.status(200).clearCookie("token").json({
    message : "Logout Successfully..."
  })
}

export const forgetPassword = async (req , res) => {
  const {email} = req.body

  if(!email) {
    return res.status(400).json({
      message :"Email  is required"
    })
  }
  try {
    const user = await User.findOne({email})

    if(!user) {
      return res.status(404).json({
        message : "User not found"
      })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    user.resetToken = tokenHash
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000)

    await user.save()

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

     await sendEmail(
      user.email,
      "Reset your password",
      `
      <P>Required password reset click this link :</P>
      <P><a href="${resetUrl}">${resetUrl}</a></P>
      `
     )

     return res.json({
      message : "If an account with this email exists , we will send you a reset link"
     })
  } catch (error) {
    console.error("Login Error:", error)

    return res.status(500).json({
      message: "Internal server error in forget password controller"
    })
  }
}

export const resetPassword = async (req, res) => {
  const {password} = req.body
  const {token} = req.params

  if(!token) {
    return res.json({
      message : "Reset token is missing"
    })
  }

  try {
     const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

     const user = await User.findOne({
      resetToken : tokenHash,
      resetTokenExpires : {$gt : new Date()}
     })

     if(!user) {
      return res.json({
        message : "Invalid or Expire Token"
      })
     }

     const hashPassword = await argon2.hash(password)

     user.password = hashPassword
     user.resetToken = undefined
     user.resetTokenExpires = undefined

     await user.save()

     return res.status(200).json({
      message : "Password reset successfully..."
     })
  } catch (error) {
    console.error("Login Error:", error)

    return res.status(500).json({
      message: "Internal server error in reset password controller"
    })
  }
}

export const getAllUser = async (req , res) => {
  try {
    const user = await User.find({}).select("-password")

    if(!user) {
      return res.json({
        user : []
      })
    }

    return res.status(200).json({
      user
    })
  } catch (error) {
    return res.status(500).json({
      message : `Internal sever error ${error?.message} get user`
    })
  }
}

export const deleteUser = async (req , res) => {
  try {
    const {id} = req.params
    if(!id) {
      return res.json({
        message : "Please Provide User ID..."
      })
    }
    const deletedUser = await User.findByIdAndDelete(id)

    return res.status(200).json({
      message : "User Deleted Successfully...",
      deletedUser
    })
  } catch (error) {
    return res.status(500).json({
      message : "Internal server error"
    })
  }
}

export const verifyEmail = async (req , res) => {
  const {email , otp} = req.body
  if(!otp || !email) {
    return res.status(400).json({
      message : "OTP and Email are required"
    })
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

  try {
    const otpRecord = await Otp.findOne({email , otpHash})

    if(!otpRecord) {
      return res.status(400).json({
        message : "Invalid OTP"
      })
    }
    const user = await User.findByIdAndUpdate(otpRecord.user , {isEmailVerified : true} , {new : true})

    await Otp.deleteMany({
      user : otpRecord.user
    })

    return res.status(200).json({
      message : "Email verified successfully",
      user
    })
  } catch (error) {
    return res.status(500).json({
      message : "Internal server error in email verification"
    })
  }
}