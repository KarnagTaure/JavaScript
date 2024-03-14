import { check, validationResult } from "express-validator";
import Usuarios from "../models/Usuarios.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";

//Abre pagina de Login
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    //Nombre de la pagina
    pagina: "Iniciar sesion",
    csrfToken: req.csrfToken(),
  });
};

//Abre pagina  de registro de usuario
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta", //Nombre de la pagina
    csrfToken: req.csrfToken(),
  });
};

//Registro de datos en la base de datos
const registrar = async (req, res, next) => {
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
      csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
    });
  }

  //Alamacenar un usuario

  const usuario = await Usuarios.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  //Enviar el email de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //Mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje:
      "Hemos enviado un Email de confirmacion , confirma en el enlace del email",
  });
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  //Verificar si el token es valido
  const usuario = await Usuarios.findOne({ where: { token } });
  if (!usuario) {
    res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intente de nuevo",
      error: true,
      csrfToken: req.csrfToken(),
    });
  }

  //Confirmar la cuenta
  if (usuario) {
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render("auth/confirmar-cuenta", {
      pagina: "Cuenta confirmada",
      mensaje: "La cuenta ha sido confirmada.",
      csrfToken: req.csrfToken(),
    });
  }
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    //Nombre de la pagina
    pagina: "Recupera su Contraseña",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  //Validación
  await check("email").isEmail().withMessage("Pon un email valido").run(req);

  let resultado = validationResult(req);

  //Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //hay errores
    return res.render("auth/olvide-password", {
      pagina: "Recupera su Contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
};

//Metodos que se exportan fuera del Script para poder llamarlos
export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
};
