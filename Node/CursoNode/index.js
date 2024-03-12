
import express from "express"
import usuarioRoutes from "./Rotes/usuarioRoutes.js"

// Crear la app
const app = express()
//Habilitar pug

app.set('view engine' , 'pug');
app.set('views','./views')
//Carpeta publica
app.use(express.static('public'));

//Routing / Rutas 
app.use("/auth", usuarioRoutes)


//Definir un puerto u arrancar el proyeto

const port=3000;

app.listen(port, () => {
    console.log(`ELServidor esta funcionando en el puerto ${port}`)
})