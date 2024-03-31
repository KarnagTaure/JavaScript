import express from "express";
import path from "path"
import csrf from 'csurf'
import cookieParser from "cookie-parser";
import usuarioRoutes from "./Routes/usuarioRoutes.js";
import propiedadesRoutes from "./Routes/propiedadesRoute.js";
import db from "./Config/db.js";


// Crear la app
const app = express();


//Habilitar  lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

//Habilitamos Cookie parse para la creacion de Cookies
app.use(cookieParser())

//Habilitamos el CSRF
app.use(csrf({cookie: true}))

//Conexion a la base de datos
const conectarBaseDatos = async () => {
  try {
    await db.authenticate();
    await db.sync(); //sincroniza con la base de datos
    console.log("Conexion correcta a la base de datos");
  } catch (error) {
    console.log(error);
  }
};

conectarBaseDatos();

//Habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");


//Carpeta publica
app.use(express.static("public"));

//Routing / Rutas
app.use("/auth", usuarioRoutes);
app.use("/", propiedadesRoutes);


//Definir un puerto u arrancar el proyeto
const port = process.env.PORT ;

app.listen(port, () => {
  console.log(`ELServidor esta funcionando en el puerto ${port}`);
});
