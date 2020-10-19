const { Schema, model } = require('mongoose');

const TiendaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    direccion: [
        {
            calle_numero: {
                type: String
            },
            cp: {
                type: String
            },
            colonia: {
                type: String
            },
            ciudad: {
                type: String
            },
            estado: {
                type: String
            }
    
        }
    ],
    telefono: {
        type: Number,
        required: true
    },
    ubicacion: [{
        lat: String,
        lng: String
    }],
    politicas: {
        type: String,
        required: true
    },
    imagenCorp: {
        type: String,
        required: true
    },
    activo: Boolean,
    imagenLogo:{
        type:String
    },
    linkFace: String,
    linkInsta: String,
    linkTweeter: String,
});

module.exports = model('tienda', TiendaSchema);