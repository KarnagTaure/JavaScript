import Propiedad from './Propiedad.mjs'
import Precio from './Precio.mjs'
import Categoria from './Categoria.mjs'
import Usuario from './Usuarios.mjs'

Propiedad.belongsTo(Precio)
Propiedad.belongsTo(Categoria)
Propiedad.belongsTo(Usuario)

export{
    Propiedad,
    Precio,
    Categoria,
    Usuario
}