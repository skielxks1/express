import "dotenv/config"
import express from 'express'

import usersRouter from "./routes/users.routes.js"
import authRouter from "./routes/auth.routes.js"

import apiKeyMiddleware from "./middleware/apk.middleware.js"

// create instance of express
const app=express()
const PORT = process.env.PORT

//Verify the JSON fuke
app.use(express.json());    

//Middleware de verificación de API Key
app.use(apiKeyMiddleware)

//Endpoints
app.use("/", usersRouter)
app.use("/auth", authRouter)



//Crear el servidor
app.listen(PORT,()=>{
    console.log(`Server running in port ${PORT}`)
    console.log("http://localhost:8000")
})