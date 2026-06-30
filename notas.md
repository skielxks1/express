agregar el complemento prismas para que lo pueda reconocer el formato prisma

Crear una tabla en prismas
Se hace en Schema.prisma
Crear una tabla:
Cuando un campo de um modelo es string se le pone signo de interrogacion
model User {
  id        Int      @id @default(autoincrement())
  studentCode String   @unique
  firstName      String
  lastName       String
  email     String   @unique
  password  String
  phone     String?
  birthday  DateTime?
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
}

pnpm db:migrate--> lleva los esquemas a posgress
pnpm db:generate-->tener listo los modelos para usarlos.

Creamos el adaptador de postgres

db:studio--> ver el gestor de bd de prismas

importamos primas al users.routes.js
import prisma from "../db/prisma.js"

Para guardar en la base de datos:
const newUser = await prisma.user.students.create({
            data: {
                "studentCode": studentCode,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": password,
                "phone": phone,
                "birthDate": birthDate,
                
            }
        })

para validar datos se usa zod

encriptar usamos la libreria bcryptjs

JWT jason web token-- estandar para poder hacer inicios de sesion en una aplicacion
https://www.jwt.io/

Creamos el archivo auth.routes.js y agregamos
import {Router} from 'express';
const authRouter = Router();

luego llevarlo al index.js
import authRouter from "./routes/auth.routes.js"

luego registar el endpoint
app.use("/auth", authRouter)

editamos el authrouter.js

agregamos un jwt secret

