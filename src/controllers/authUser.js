import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
import University from "../models/university.model.js"
import Course from "../models/course.model.js"
import Semester from "../models/semester.model.js"

export const UserRegister = async (req, res) => {

    const { username, email, password, university, course, semester } = req.body

    try {

        // Basic validation
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            })
        }

        // Check existing user
        const isExistUser = await User.findOne({email})

        if (isExistUser) {
            return res.status(400).json({
                message: "User already exists with this email"
            })
        }

        console.log("Request Body:", req.body)

        // Hash password
        const hashPassword = await argon2.hash(password)

        // Save university, course, semester
        const uni = await new University({university_name: university }).save()
        const cou = await new Course({ course_name :course }).save()
        const sem = await new Semester({ semester }).save()

        // Create user
        const newUser = new User({
           name : username,
            email: email,
            password: hashPassword,
            university_id: uni._id,
            course_id: cou._id,
            semester_id: sem._id
        })

        await newUser.save()

        // Remove password before sending response
        const userResponse = newUser.toObject()
        delete userResponse.password

        return res.status(201).json({
            message: "User created successfully",
            user: userResponse
        })

    } catch (error) {

        console.error("Register Error:", error)

        return res.status(500).json({
            message: "Internal server error in register controller",
            error: error.message
        })
    }
}

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
    const user = await User.findOne({email})

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password)

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email/phone or password"
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

    res.cookie("token", token, options)

    return res.status(200).json({
      message: "Login successfully",
      token
    })

  } catch (error) {

    console.error("Login Error:", error)

    return res.status(500).json({
      message: "Internal server error in login controller"
    })
  }
}