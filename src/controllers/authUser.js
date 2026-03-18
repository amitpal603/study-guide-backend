import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
import University from "../models/university.model.js"
import Course from "../models/course.model.js"
import Semester from "../models/semester.model.js"

export const UserRegister = async (req, res) => {
  try {
    const { username, email, password, university, course, semester, role } = req.body;

    console.log("Request Body:", req.body);

    // Check existing user
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashPassword = await argon2.hash(password);

    //  ADMIN REGISTER
    if (role === "ADMIN") {
      const admin = await User.create({
        username,
        email,
        password: hashPassword,
        role: "ADMIN",
      });

      return res.status(201).json({
        message: "Admin created successfully",
        admin,
      });
    }

    //  USER REGISTER
    let uni = await University.findOne({ university_name: university });
    if (!uni) {
      uni = await new University({ university_name: university }).save();
    }

    let cou = await Course.findOne({
      course_name: course,
      university_id: uni._id,
    });

    if (!cou) {
      cou = await new Course({
        course_name: course,
        university_id: uni._id,
      }).save();
    }

    let sem = await Semester.findOne({
      semester: semester,
      course_id: cou._id,
    });

    if (!sem) {
      sem = await new Semester({
        semester: semester,
        course_id: cou._id,
      }).save();
    }

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      role: role || "USER",
      university_id: uni._id,
      course_id: cou._id,
      semester_id: sem._id,
    });

    return res.status(201).json({
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      message: "Internal server error in register controller",
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

