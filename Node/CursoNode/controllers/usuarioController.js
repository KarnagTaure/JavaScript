import { check, validationResult } from "express-validator";
import Usuarios from "../models/Usuarios.js";

//Abre pagina de Login
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    //Nombre de la pagina
    pagina: "Iniciar sesion",
  });
};

//Abre pagina  de registro de usuario
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    //Nombre de la pagina
    pagina: "Crear cuenta",
  });
};

//Registro de datos en la base de datos
const registrar = async (req, res) => {
  console.log(req.body);

  //Validación
  await check("nombre")
    .notEmpty()
    .withMessage("Rellene el campo nombre")
    .run(req);

  await check("email").isEmail().withMessage("Pon un email valido").run(req);

  await check("password")
    .isLength({ min: 8 })
    .withMessage("Minimo 8 caracteres")
    .run(req);

  await check("repetir_password")
    .equals(req.body.password)
    .withMessage(" Los Password no son iguales")
    .run(req);

  let resultado = validationResult(req);

  // return res.json({ errores: resultado.array() });

  //Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //hay errores
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  //Extraer datos
  const { nombre, email, password } = req.body;

  //Verificar que el usuario no este repetido
  const existeUsuario = await Usuarios.findOne({ where: { email } });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      errores: [{ msg: "El usuario ya esta registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  //Alamacenar un usuario

  await Usuarios.create({
    nombre,
    email,
    password,
    token: 123,
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    //Nombre de la pagina
    pagina: "Recupera su Contraseña",
  });
};

//Metodos que se exportan fuera del Script para poder llamarlos
export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
};
