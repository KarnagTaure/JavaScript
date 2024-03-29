import express from "express";
import { body } from "express-validator";
import { admin, crear,guardar } from "../controllers/propiedadesController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);
router.get("/propiedades/crear", crear);
router.post("/propiedades/crear",
body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
guardar
);

export default router;
