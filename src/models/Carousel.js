const { Schema, model } = require('mongoose');

const CarouselSchema = new Schema({
    producto: String,
    nombre: String,
    imagenes: [{
        imagen: String,
        size: String
    }]
},
{
    timestamps: true
});

module.exports = model('carousel', CarouselSchema);