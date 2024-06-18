import path from 'path'


export default{
    mode: 'development',
    entry:{
        mapa:'./src/js/mapa.js',
        agregarImagen: './src/js/agregarImagen.js',
        mostarMapa: './src/js/mostrarMapa.js',
        mapaInicio: './src/js/mapaInicio.js'


    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/Js')

    }
}