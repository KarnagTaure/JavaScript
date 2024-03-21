import { DataTypes } from "sequelize";
import db from "../Config/db.js";

//crea una Tabla en la base de datos
const Propiedades = db.define("propiedades", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  habitacioens: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estacionamiento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  wc: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  calle: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
export default Propiedades;
