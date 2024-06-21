import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure:true,  
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;
  //Envio de email
  await transport.sendMail({
    from: "MeiyoDojo",
    to: email,
    subject: "Confirmación del email en MeiyoDojo",
    text: "Confirmacion de la cuenta",
    html: `
        <h1>Bienvenido a Meiyo Dojo</h1>  
        <p>Hola ${nombre}, es te email es de confirmación de la cuenta en MeiyoDojo</p>

        <p>Tu cuenta ya esta lista, solo deves acceder en el siguiente en lace para confirmar el email: <a href="${
          process.env.BACKEND_URL
        }:${
      process.env.PORT ?? 3000
    }/auth/confirmar/${token}">Confirmar Email</a></p>

        <p>Si tu no has creado esta cuenta, puedes ignorar el mensaje</p>       
        `,
  });
};

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;
  //Envio de email
  await transport.sendMail({
    from: "MeiyoDojo",
    to: email,
    subject: "Genera nuevo Password en MeiyoDojo",
    text: "Regenera nueva password",
    html: `
      <h1>Olvido su Contraseña en Meiyo Dojo</h1>  
      <p>Hola ${nombre}, has solicitado generar un nuevo Password en la cuenta de MeiyoDojo</p>

      <p>Para porder cambiar la contraseña debe acceder al siguiente enlace: <a href="${
        process.env.BACKEND_URL
      }:${
      process.env.PORT ?? 3000
    }/auth/olvide-password/${token}">Restablecer Contraseña</a></p>

      <p>Si usted no has solicitado restablecer el password, puedes ignorar el mensaje</p>       
      `,
  });
};

export { emailRegistro, emailOlvidePassword };
