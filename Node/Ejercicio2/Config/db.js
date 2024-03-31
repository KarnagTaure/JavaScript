import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// los datos de la BD estan en un archivo .env
const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASS ?? "",
  {
    //Datos de conexion de la Base de datos
    host: process.env.BD_HOST,
    port: 3306,
    dialect: "mariadb",// tipo de base de datos pueden ser mysql,mongodb, mariadb...
    define: {
      timestamps: true,
    },

    //Mantener o reutilizar las conexiones y se mantengan vivas y no se cree una nueva
    pool: {
      max: 5, // max conexiones que realiza una persona
      min: 0, //
      acquire: 30000, //30 segundos que tarda en intentar de mantener conexion antes de dar error de conexion
      idle: 10000, //tiempo que tiene que transcurrir para finalizar una conexion a la BS para liverar memoria
    },
    //operatorsAliases: false
  }
);

export default db;
