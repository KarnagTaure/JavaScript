import { DataTypes } from "sequelize";
import db from "../Config/db.js";

//crea una Tabla en la base de datos
const Mensaje = db.define("mensajes", {
  mensaje: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
});

export default Mensaje;
