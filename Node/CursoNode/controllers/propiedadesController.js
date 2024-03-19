const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
    barra: true,
  });
};
//Formulario para crear Nueva tarea
const crear = (req, res) => {
  res.render("propiedades/crear", {
    pagina: "Crear Tarea",
    barra: true,
  });
};
export { admin, crear };
