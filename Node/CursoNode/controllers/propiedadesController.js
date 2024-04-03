import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
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
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
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
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  // Creamos un Registro

  const {
    titulo,
    descripcion,
    categoria: categoriaId,
    precio: precioId,
    habitaciones,
    estacionamiento,
    wc,
    calle,
    lat,
    lng,
  } = req.body;

  const { id: usuarioId } = req.usuario;
  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      categoriaId,
      precioId,
      usuarioId,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      imagen: "",
    });

    const { id } = propiedadGuardada;

    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {

  const {id}= req.params

  // Validar propiedad
  const propiedad = await Propiedad.findByPk(id)

  if(!propiedad){
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad no existe 
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad pertenece a quien la visita
  if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
    return res.redirect('/mis-propiedades')
  }


  res.render("propiedades/agregar-imagen",{
    pagina: "Agregar Imagen",
    propiedad
  });
};

export { admin, crear, guardar, agregarImagen };
