import "dotenv"
import express from 'express'

// create instance of express
const app=express()
const PORT = process.env.PORT

//Verify the JSON fuke
app.use(express.json());    

// making the endpoints
app.get("/", (req, res)=>{
    //searching in the database
    console.log("Someone have browsed the endpoint")
    res.status(200).json({message:"Get endpoint working"})
})

app.post("/create",(req, res)=>{
    const {name, edad} = req.body
    if(!name || !edad){
        return res.status(400).json({message:"Faltan datos"})
    }
    res.status(201).json({message:"Usuario creado"})
})

app.put("/update/:id", (req, res) => {
    const { id } = req.params
    const {name, age} = req.body
    if (!name || !age){
        return res.status(400).json({message: "Faltan datos: nombre o edad"})
    }
    res.status(200).json({message: `El usuario con ID: ${id} se ha actualizado`})
})

app.delete("/delete/:id", (req, res) => {
    const { id } = req.params
    const {name, age} = req.body
    if (!name || !age){
        return res.status(400).json({message: "Faltan datos: nombre o edad"})
    }
    res.status(200).json({message: `El usuario con ID: ${id} se ha eliminado`})
})
//mi primer endpoint
app.get("/test",(req,res)=>{
res.status(200).json({message:"Hola desde mi primer API jajajajaaaaaa"})

})

//Crear el servidor
app.listen(PORT,()=>{
    console.log('Server running in port ',PORT)
    console.log("http://localhost:8000")
})