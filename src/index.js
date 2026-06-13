import express from 'express'

// crear instancia
const app=express()
const PORT=8000

//Especificar JSON
app.use(express.json());

// crear endpoints
app.get("/", (req, res)=>{
    //buscar en la base de datos
    console.log("Alguien consulto el endpoint")
    res.status(200).json({message:"endpoint de obtener funcionando"})
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