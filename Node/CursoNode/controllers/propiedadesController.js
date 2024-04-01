import { validationResult } from "express-validator";
import Precio from "../models/Precio.js";
import Categoria from "../models/Categoria.js";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
    barra: true,
  });
};

//Formulario para crear Nueva tarea
const crear = async (req, res) => {
  //Consultar modelo de precio y Categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/crear", {
    pagina: "Crear Tarea",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {}
  });
};

const guardar = async (req, res) => {
  // Validacion
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //Consultar modelo de precio y Categoria
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    return res.render("propiedades/crear", {
      pagina: "Crear Tarea",
      barra: true,
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body
    });


  }

// Creamos un Registro

console.log(req.body);

};

export { admin, crear, guardar };
