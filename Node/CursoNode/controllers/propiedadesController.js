import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const admin = async (req, res) => {
  const { id } = req.usuario;
  const propiedades = await Propiedad.findAll({
    where: {
      usuarioId: id,
    },
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });

  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
    propiedades: propiedades,
    csrfToken: req.csrfToken(),
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
  const { id } = req.params;

  // Validar propiedad
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Validar que la propiedad no existe
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  // Validar que la propiedad pertenece a quien la visita
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  res.render("propiedades/agregar-imagen", {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  });
};

const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;

  // Validar propiedad
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Validar que la propiedad no existe
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  // Validar que la propiedad pertenece a quien la visita
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  try {
    console.log(req.file);

    // Alamacenar imagen  y public propiedad
    propiedad.imagen = req.file.filename;

    propiedad.publicado = 1;

    await propiedad.save();

    next();
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  const { id } = req.params;

  // Validar que exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  // REvisar quien visita es quien la creo
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  //Consultar modelo de precio y Categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/editar", {
    pagina: `Editar ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad,
  });
};
const guardarCambios = async (req, res) => {
  // Verificar la validacion

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //Consultar modelo de precio y Categoria
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);
    res.render("propiedades/editar", {
      pagina: "Edita Tarea",
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  const { id } = req.params;

  // Validar que exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  // REvisar quien visita es quien la creo
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }
  // Reescribir el objeto
  try {
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

    propiedad.set({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      categoriaId,
      precioId,
    });

    await propiedad.save();
    res.redirect("/mis-propiedades");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;

  // Validar que exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  // REvisar quien visita es quien la creo
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }
  
  // Eliminar imagen
  await unlink(`public/uploads/${propiedad.imagen}`);
  console.log(`Se elimino la imagen: ${propiedad.imagen}`);

  // Eliminar datos
  await propiedad.destroy();
  res.redirect("/mis-propiedades");
};

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
};
