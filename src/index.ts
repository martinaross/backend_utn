
import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import connectDB from "./config/mongodb"
import productRouter from "./routes/productRoutes"
import authRouter from "./routes/authRouter"
import morgan from "morgan"
import IUserTokenPayload from "./interfaces/IUserTokenPayload"
import dotenv from "dotenv"
import logger from "./config/logger"
import path from "node:path"
import fs from "node:fs"
import emailService from "./services/emailService"


dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload
    }
  }
}

const PORT = process.env.PORT || 4000
const app = express()


app.use(cors())
app.use(express.json())


app.use(morgan("dev"))

app.use(logger)


const uploadsPath = path.join(__dirname, "../uploads")

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}
app.use("/uploads", express.static(uploadsPath))


app.get("/", (__: Request, res: Response) => {
  res.json({ status: true, message: "API REST running" })
})

app.use("/auth", authRouter)
app.use("/products", productRouter)

app.post("/email/send", emailService)



app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "El recurso no se encuentra" })
})


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

  console.error("--- ERROR EN SERVIDOR ---");
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Error interno del servidor. Por favor, revise el log.",

    error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
  });
});



app.listen(PORT, () => {
  console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`)
  connectDB()
})