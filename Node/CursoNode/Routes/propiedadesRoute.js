import express from "express";
import { body } from "express-validator";
import {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  cambiarEstado,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes
} from "../controllers/propiedadesController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from '../middleware/identificarUsuaro.js'

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);
router.get("/propiedades/crear", protegerRuta, crear);
router.post(
  "/propiedades/crear",
  protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion del anuncio es obligatorio")
    .isLength({ max: 200 })
    .withMessage("La descripcion es demasiado larga"),
  body("categoria").isNumeric().withMessage("Selecciona una categoria"),
  body("precio").isNumeric().withMessage("Selecciona un precio"),
  body("habitaciones").isNumeric().withMessage("Selecciona una habitacion"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona un estacionamiento"),
  body("wc").isNumeric().withMessage("Selecciona numero de wc"),
  body("lat").notEmpty().withMessage("Selecciona la posicion en el Mapa"),
  guardar
);
router.get("/propiedades/agregar-imagen/:id", protegerRuta, agregarImagen);

router.post("/propiedades/agregar-imagen/:id",
  protegerRuta,
  upload.single("imagen"),
  almacenarImagen
);
router.get('/propiedades/editar/:id', protegerRuta,editar)
router.post(
  '/propiedades/editar/:id',
  protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion del anuncio es obligatorio")
    .isLength({ max: 200 })
    .withMessage("La descripcion es demasiado larga"),
  body("categoria").isNumeric().withMessage("Selecciona una categoria"),
  body("precio").isNumeric().withMessage("Selecciona un precio"),
  body("habitaciones").isNumeric().withMessage("Selecciona una habitacion"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona un estacionamiento"),
  body("wc").isNumeric().withMessage("Selecciona numero de wc"),
  body("lat").notEmpty().withMessage("Selecciona la posicion en el Mapa"),
  guardarCambios
);
router.post("/propiedades/eliminar/:id",
protegerRuta,
eliminar
)

router.put('/propiedades/:id',
  protegerRuta,
  cambiarEstado
)
//Area publica
router.get('/propiedad/:id',
  identificarUsuario, 
  mostrarPropiedad
)

// Almacenar los mensajes
router.post('/propiedad/:id',
  identificarUsuario,
  body('mensaje').isLength({min:10}).withMessage('El mensaje no puede ir vacio o es muy corto'),
  enviarMensaje
)

router.get('/mensajes/:id',
  protegerRuta,
  verMensajes
)

export default router;
