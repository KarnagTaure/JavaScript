import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config({path:'.env'})

const db= new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER,process.env.BD_PASS ??'',{
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mariadb',
    define:{
        timestamps: true
    },
    pool:{//Mantener o reutilizar la sconexiones se mantengan vivas y no se cree una nueva
        max:5,// max conexxiones que realiza una persona
        min:0,//
        acquire: 30000,//30 segundos que tarda en intentar de mantener conexion antes de dar error de conexion
        idle:10000//tiempo que tiene que transcurrir para finalizar una conexion a la BS para liverar memoria
    },
    //operatorsAliases: false
})
export default db
