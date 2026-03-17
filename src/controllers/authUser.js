import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
import University from "../models/university.model.js"
import Course from "../models/course.model.js"
import Semester from "../models/semester.model.js"

export const UserRegister = async (req, res) => {

    const { username, email, phone, password, university, course, semester } = req.body

    try {

        // Basic validation
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            })
        }

        // Check existing user
        const isExistUser = await User.findOne({
            $or: [
                { email: email || null },
                { phone: phone || null }
            ]
        })

        if (isExistUser) {
            return res.status(400).json({
                message: "User already exists with this email or phone"
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
            email: email || undefined,
            phone: phone || undefined,
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

