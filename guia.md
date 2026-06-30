# 🚀 Guía Profesional de Desarrollo Backend Modular
## Node.js + Express + Prisma + PostgreSQL + Zod + JWT + pnpm

---

## 📖 Descripción General

Esta guía documenta el proceso completo para crear una **API REST profesional, modular y escalable** utilizando buenas prácticas modernas del ecosistema JavaScript.

### Objetivos del Proyecto

- Construir una API REST modular.
- Implementar validación robusta de datos.
- Gestionar autenticación mediante JWT.
- Utilizar Prisma ORM para persistencia.
- Aplicar separación por capas.
- Automatizar reinicios durante desarrollo.

---

# 📚 Stack Tecnológico

| Tecnología | Propósito |
|------------|----------|
| Node.js | Entorno de ejecución |
| Express | Framework Backend |
| PostgreSQL | Base de datos |
| Prisma ORM | ORM |
| Zod | Validación |
| bcryptjs | Seguridad de contraseñas |
| JWT | Autenticación |
| dotenv | Variables de entorno |
| pnpm | Administrador de paquetes |
| Nodemon | Reinicio automático |

---

# 🏗️ FASE 1 — Inicializar Proyecto

## Crear directorio e iniciar proyecto

```bash
mkdir api_rest
cd api_rest

pnpm init
```

---

## Crear estructura profesional

```bash
mkdir prisma

mkdir src
mkdir src/config
mkdir src/controllers
mkdir src/services
mkdir src/routes
mkdir src/middleware
mkdir src/lib
mkdir src/utils
mkdir src/schemas
```

---

# 📁 Estructura Final del Proyecto

```plaintext
api_rest/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│
│   ├── config/
│   │   └── env.js
│   │
│   ├── controllers/
│   │   └── users.controller.js
│   │
│   ├── services/
│   │   └── users.service.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── routes/
│   │   ├── users.routes.js
│   │   └── index.js
│   │
│   ├── schemas/
│   │   └── user.schema.js
│   │
│   ├── lib/
│   │   └── prisma.js
│   │
│   ├── utils/
│   │   └── jwt.js
│   │
│   └── index.js
│
├── .env
├── nodemon.json
├── package.json
└── node_modules/
```

---

# 📦 FASE 2 — Instalar Dependencias

## Dependencias de Producción

```bash
pnpm add \
express \
@prisma/client \
bcryptjs \
jsonwebtoken \
dotenv \
cors \
zod
```

---

## Dependencias de Desarrollo

```bash
pnpm add -D prisma nodemon
```

---

# ⚙️ FASE 3 — Configuración del Entorno

## Archivo: `nodemon.json`

```json
{
  "watch": [
    "src"
  ],
  "ext": "js",
  "ignore": [
    "node_modules"
  ],
  "exec": "node src/index.js"
}
```

---

## Configurar `package.json`

Agregar dentro del objeto `scripts`:

```json
{
  "scripts": {
    "dev": "nodemon",
    "start": "node src/index.js",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate"
  }
}
```

---

# 🔐 FASE 4 — Variables de Entorno

## Archivo: `.env`

```env
PORT=8000

DATABASE_URL="postgresql://postgres:1234@localhost:5432/api_rest"

JWT_SECRET="MiClaveJWTSuperSegura"

JWT_EXPIRES=8h
```

---

# 🗄️ FASE 5 — Configurar Prisma ORM

## Inicializar Prisma

```bash
pnpm prisma init
```

---

## Archivo: `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {

  id          Int       @id @default(autoincrement())

  name        String

  email       String    @unique

  password    String

  phone       String?

  birthDate   DateTime?

  createdAt   DateTime  @default(now())

  updatedAt   DateTime  @updatedAt

}
```

---

## Ejecutar Migración

```bash
pnpm db:migrate --name init
```

---

## Generar Prisma Client

```bash
pnpm db:generate
```

---

# 🧩 FASE 6 — Prisma Client

## Archivo: `src/lib/prisma.js`

```javascript
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default prisma
```

---

# 📝 FASE 7 — Validación con Zod

## Archivo: `src/schemas/user.schema.js`

```javascript
import { z } from "zod"

export const registerSchema = z.object({

  name: z
    .string()
    .min(2, "Name is required"),

  email: z
    .string()
    .email(),

  password: z
    .string()
    .min(6),

  phone: z
    .string()
    .optional(),

  birthDate: z
    .string()
    .optional()

})
```

---

# 🧠 FASE 8 — Middleware

## Archivo: `src/middleware/validate.middleware.js`

```javascript
export const validate = (schema) => {

  return (req, res, next) => {

    const result = schema.safeParse(req.body)

    if (!result.success) {

      return res.status(400).json({

        errors: result.error.errors

      })

    }

    next()

  }

}
```

---

# 🔑 FASE 9 — JWT

## Archivo: `src/utils/jwt.js`

```javascript
import jwt from "jsonwebtoken"

export const createToken = (payload) => {

  return jwt.sign(

    payload,

    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_EXPIRES
    }

  )

}
```

---

# ⚙️ FASE 10 — Servicios

## Archivo: `src/services/users.service.js`

```javascript
import prisma from "../lib/prisma.js"

export const createUser = async (data) => {

  return await prisma.user.create({

    data

  })

}
```

---

# 🎯 FASE 11 — Controlador

## Archivo: `src/controllers/users.controller.js`

```javascript
import bcrypt from "bcryptjs"

import { createToken }

from "../utils/jwt.js"

import { createUser }

from "../services/users.service.js"

export const register = async (req, res) => {

  try {

    const hashedPassword = await bcrypt.hash(

      req.body.password,

      10

    )

    const user = await createUser({

      ...req.body,

      password: hashedPassword

    })

    const token = createToken({

      id: user.id

    })

    res.status(201).json({

      message: "User created",

      token,

      user

    })

  }

  catch (error) {

    res.status(500).json({

      message: "Internal Server Error"

    })

  }

}
```

---

# 🌐 FASE 12 — Rutas

## Archivo: `src/routes/users.routes.js`

```javascript
import { Router }

from "express"

import { register }

from "../controllers/users.controller.js"

const router = Router()

router.post(

  "/register",

  register

)

export default router
```

---

## Archivo: `src/routes/index.js`

```javascript
import { Router }

from "express"

import usersRoutes

from "./users.routes.js"

const router = Router()

router.use(

  "/users",

  usersRoutes

)

export default router
```

---

# 🚀 FASE 13 — Servidor Principal

## Archivo: `src/index.js`

```javascript
import express from "express"

import cors from "cors"

import dotenv from "dotenv"

import routes from "./routes/index.js"

dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api", routes)

app.listen(

  process.env.PORT,

  () => {

    console.log("====================================")

    console.log("SERVER RUNNING")

    console.log(
      `http://localhost:${process.env.PORT}`
    )

    console.log("====================================")

  }

)
```

---

# ▶️ FASE 14 — Ejecutar Proyecto

```bash
pnpm dev
```

---

# 🧪 Endpoint de Prueba

```http
POST http://localhost:8000/api/users/register
```

Body:

```json
{
  "name": "Fernando",
  "email": "fernando@gmail.com",
  "password": "123456",
  "phone": "50370000000",
  "birthDate": "2000-10-15"
}
```

---

# ✅ Resultado Esperado

- Arquitectura Modular
- Validación con Zod
- Seguridad JWT
- Prisma ORM
- PostgreSQL
- Backend listo para producción

---

## Vista previa en VS Code

Abrir archivo `.md`

```text
Ctrl + Shift + V
```

Vista dividida:

```text
Ctrl + K V
```