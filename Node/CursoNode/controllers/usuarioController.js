import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuarios from "../models/Usuarios.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js";
import { assign } from "nodemailer/lib/shared/index.js";

//Abre pagina de Login
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    //Nombre de la pagina
    pagina: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  //Validando datos
  await check("email").isEmail().withMessage("Email no valido").run(req);

  await check("password")
    .notEmpty()
    .withMessage("Contraseña obligatoria")
    .run(req);

  let resultado = validationResult(req);

  //Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //hay errores
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
    });
  }
  //Comprobar que el usuario existe
  const { email, password } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      errores: [{ msg: "El usuario no existe" }],
      csrfToken: req.csrfToken(),
    });
  }

  //Comprobar usuario confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      errores: [{ msg: "El usuario no esta confirmado" }],
      csrfToken: req.csrfToken(),
    });
  }

  //Revisar el password
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      errores: [{ msg: "La contraseña es incorrecta" }],
      csrfToken: req.csrfToken(),
    });
  }

  //Autenticar Usuario
  const token = generarJWT({id:usuario.id, nombre: usuario.nombre});

  console.log(token);

  //Almacenamos en un Cookie
      //esto crea un cookie con el nombre _token
  return res.cookie('_token',token, {
    //Seguridad para que no se lea el contenido del token 
    httpOnly: true,
    secure: true,
    //sameSite:true,
    
  }).redirect('/mis-propiedades')
};

const cerrarSesion=(req,res)=>{
  
  return res.clearCookie('_token').status(200).redirect('/auth/login')
}

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
      "Hemos enviado un Email de confirmacion, mira en la carpeta de Span y confirma en el enlace del email",
  });
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  //Verificar si el token es valido
  const usuario = await Usuarios.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
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
    pagina: "Recupera Contraseña",
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
      pagina: "Recupera Contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  //Buscar usuario registrado
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });
  //Sino hay Usuario registrado
  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Recupera Contraseña",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El email no pertenece a ningun Usuario registrado" }],
    });
  }

  //Generar token y enviar Email
  usuario.token = generarId();
  await usuario.save();
  //Enviar un Email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });

  //Renderizar un mensaje para que revise la bandeja de entrada
  res.render("templates/mensaje", {
    pagina: "Restablecer Contraseña",
    mensaje: "Hemos enviado un Email para restablecer la contraseña ",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuarios.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Restablecer Contraseña",
      mensaje: "Hubo un error al confirmar tu cuenta, intente de nuevo",
      error: true,
    });
  }

  //Mostrar formulario para modificar Password
  res.render("auth/reset-password", {
    pagina: "Restablece la Contraseña",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  //validar el pasword
  await check("password")
    .isLength({ min: 8 })
    .withMessage("Minimo 8 caracteres")
    .run(req);

  let resultado = validationResult(req);

  //Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //hay errores
    return res.render("auth/reset-password", {
      pagina: "Restablecer Contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  const { token } = req.params;
  const { password } = req.body;

  //identificar quien hace el cambio
  const usuario = await Usuarios.findOne({ where: { token } });

  //Hasear el nuevo pasword
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();
  res.render("auth/confirmar-cuenta", {
    pagina: "Contraseña Restablecida",
    mensaje: "La contraseña se restablecio correctamente",
  });
};

//Metodos que se exportan fuera del Script para poder llamarlos
export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  cerrarSesion
};
