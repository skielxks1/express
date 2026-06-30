import {Router} from "express"
import prisma from "../lib/prisma.js"
import bcrypt from "bcryptjs"
import {z} from "zod"

const usersRouter = Router()
const studentSchema=z.object({
    studentCode:z.string().min(5, "The student code must be at least 5 characters long").max(10, "The student code must be at most 10 characters long"),
    firstName:z.string().min(5, "The first name must be at least 5 characters long").max(50, "The first name must be at most 50 characters long"),
    lastName:z.string().min(5, "The last name must be at least 5 characters long").max(50, "The last name must be at most 50 characters long"),
    email:z.string().email("Invalid email format"),
    password:z.string().min(8, "The password must be at least 6 characters long"),
    phone:z.string().optional(),
    birthDate:z.string().optional()
})

const validate = (schema) => (req, res, next) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors
            })
        }
        req.validateData=result.data
        next()
    }

usersRouter.get("/get", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: {
                id: "asc"
            }
        })
        res.status(200).json({
            success: true,
            data: students
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

usersRouter.get("/get/:id", async (req, res) => {
    const id = Number(req.params.id)
    try {
        const student = await prisma.student.findUnique({
            where: {
                id: id
            }
        })
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            })
        }
        res.status(200).json({
            success: true,
            data: student
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

usersRouter.post("/create",validate(studentSchema),async (req, res)=>{
   const {studentCode, firstName, lastName, email, password, phone, birthDate} = req.body
   const hashedPassword = await bcrypt.hash(password, 12) // Hash the password with a salt of 12 rounds so that it can be stored securely in the database  
    try {
        const newUser = await prisma.student.create({
            data: {
                "studentCode": studentCode,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": hashedPassword,
                "phone": phone,
               birthDate: new Date(birthDate)

            }
        })
        res.status(201).json({
            success: true,
            message: "New student created successfully"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
})

usersRouter.put("/update/:id", async (req, res) => {
    const id = Number(req.params.id)
    const {
        studentCode,
        firstName,
        lastName,
        email,
        password,
        phone,
        birthDate
    } = req.body
    try {
        const updatedStudent = await prisma.student.update({
            where: {
                id: id
            },
            data: {
                studentCode,
                firstName,
                lastName,
                email,
                password,
                phone,
                birthDate: birthDate ? new Date(birthDate) : undefined
            }
        })
        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: updatedStudent
        })
    } catch (error) {
        console.error(error)
        res.status(404).json({
            success: false,
            message: "Student not found or duplicated data"
        })

    }

})

usersRouter.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id)
    try {
        const student = await prisma.student.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.status(200).json({
            success: true,
            message: "Student deleted successfully",

        })
    } catch (error) {
        console.error(error)
        res.status(404).json({
            success: false,
            message: "Student not found"
        })
    }

})

//mi primer endpoint
usersRouter.get("/test",(req,res)=>{
res.status(200).json({message:"Hola desde mi primer API jajajajaaaaaa"})

})

export default usersRouter
