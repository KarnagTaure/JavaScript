import express from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadesController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);
router.get("/propiedades/crear", crear);
router.post("/propiedades/crear", body("titulo").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
body("descripcion")
    .notEmpty().withMessage("La descripcion del anuncio es obligatorio")
    .isLength({max: 200}).withMessage("La descripcion es demasiado larga"),
body('categoria').isNumeric().withMessage('Selecciona una categoria'),
body('precio').isNumeric().withMessage('Selecciona un precio'),
body('habitaciones').isNumeric().withMessage('Selecciona una habitacion'),
body('estacionamiento').isNumeric().withMessage('Selecciona un estacionamiento'),
body('wc').isNumeric().withMessage('Selecciona numero de wc'),
body('lat').notEmpty().withMessage('Selecciona la posicion en el Mapa'),
guardar);

export default router;
