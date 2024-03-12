

const formularioLogin = (req, res) => {
     res.render('auth/login', {
         pagina: 'Iniciar sesion'
     })
 };

 const formularioRegistro =(req,res) =>{
    res.render('auth/registro',{
        pagina: 'Crear cuenta'
    })
 };

 const formularioOlvidePassword =(req,res) =>{
    res.render('auth/olvide-password',{
        pagina: 'Recupera su Contraseña'
    })
 };

 export {
    formularioLogin, 
    formularioRegistro,
    formularioOlvidePassword
 }