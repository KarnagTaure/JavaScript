import { DataTypes } from "sequelize";
import db from "../Config/db.js";

//crea una Tabla en la base de datos
const Precio = db.define("precios", {
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

export default Precio;
