import { DataTypes, Sequelize } from "sequelize";
import bcypt from "bcrypt";
import db from "../Config/db.js";

const Usuario = db.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
  },
  {
    hooks: {
      beforeCreate: async function (usuario) {
        const salt = await bcypt.genSalt(10);
        usuario.password = await bcypt.hash(usuario.password, salt);
      },
    },
  }
);
export default Usuario;
