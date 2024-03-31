import { DataTypes } from "sequelize";
import db from "../Config/db.js";

//crea una Tabla en la base de datos
const Categoria = db.define("categorias", {
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

export default Categoria;
