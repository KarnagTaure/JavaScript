import express from 'express'
import { inicio,categoria,noEncontrado,buscador } from '../controllers/appController.js'
import identificarUsuario from '../middleware/identificarUsuaro.js'



const router = express.Router()


//Pagina de Inicio

router.get('/',identificarUsuario, inicio)

//categorias
router.get('/categorias/:id',identificarUsuario,categoria)

//Pagina 404
router.get('/404',noEncontrado)

//buscador
router.post('/buscador',buscador)

export default router;