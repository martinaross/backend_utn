import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import sendEmail from "../services/emailService"
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET!

class AuthController {

  static register = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Datos invalidos" })
      }

      const user = await User.findOne({ email })

      if (user) {
        return res.status(409).json({ success: false, error: "El usuario ya existe en la base de datos." })
      }

      const hash = await bcrypt.hash(password, 10)
      const newUser = new User({ email, password: hash })
      await newUser.save()


      await sendEmail({
        to: newUser.email,
        subject: "¡Bienvenido a la Tienda UTN! 🎉",
        message: "Tu cuenta fue creada con éxito. ¡Gracias por registrarte!"
      })

      return res.status(201).json({ success: true, data: newUser })

    } catch (e) {
      const error = e as Error
      switch (error.name) {
        case "MongoServerError":
          return res.status(409).json({ success: false, error: "Usuario ya existente en nuestra base de datos" })
      }
      return res.status(500).json({ success: false, error: error.message })
    }
  }

  static login = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Datos invalidos" })
      }

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      )

      return res.json({ success: true, token })

    } catch (e) {
      const error = e as Error
      return res.status(500).json({ success: false, error: error.message })
    }
  }
}

export default AuthController
