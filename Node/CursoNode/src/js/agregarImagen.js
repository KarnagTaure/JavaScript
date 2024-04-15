import {Dropzone} from 'dropzone'

const token= document.querySelector('meta[name="csrf-token"]').getAttribute('content')

console.log(token)

Dropzone.options.imagen = {
    dictDefaultMessage: 'Haz click o arrastra tu Imagen aqui',
    acceptedfiles: '.png, .jpg',
    maxFilesizw: 5,
    maxFiles: 2,
    parallelUploads:2,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'Maximo 2 archivos',
    headers:{
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href='/mis-propiedades'
            }
        })
    }

}