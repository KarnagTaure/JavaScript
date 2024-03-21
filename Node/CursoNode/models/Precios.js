import { DataTypes } from "sequelize";
import db from "../Config/db.js";

//crea una Tabla en la base de datos
const Precios = db.define("propiedades", {
  precio: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

export default Precios;
