import { exit } from "node:process";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import db from "../Config/db.js";
import {Categoria, Precio, Usuario} from '../models/index.js'


const importarDatos = async () => {
  try {
    // Autencticar en la base d edatos
    await db.authenticate();

    // Generar las columnas
    await db.sync();

    // Insertamos los datos

    // Esto hace que estos procesos se hagan ala vez
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
      Usuario.bulkCreate(usuarios)

    ]);

    // Esta forma hace que cada proceso no se ejecute hasta que el otro no ha terminado, biene bien para procesos que uno dependa de otro
    /*await Categoria.bulkCreate(categorias);
    await Precios.bulkCreate(precios);*/

    console.log("Datos Importados Correctamente");

    exit(0);
  } catch (error) {
    console.log(error);
    exit(1);
  }
};
const eliminarDatos = async () => {
  try {
    // Esta forma funciona eliminando el contenido de las tablas
    /*await Promise.all([
      Categoria.destroy({ where: {}, truncate: true }),
      Precios.destroy({ where: {}, truncate: true }),
    ]);*/

    // Esta forma es solo una linea y elimina todas las tablas que tengas en la base de datos biene bien cuando son muchas tablas
    await db.sync({ force: true });
    console.log("Datos Eliminar Correctamente");
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDatos();
}
if (process.argv[2] === "-e") {
  eliminarDatos();
}
