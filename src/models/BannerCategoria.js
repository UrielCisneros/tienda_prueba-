const {Schema,model} = require('mongoose');

const bannerCategoria = new Schema({
    categoria: String,
    imagenBanner: String,
    vincularCategoria: Boolean,
    mostrarProductos: Boolean,
    mostrarTitulo: Boolean
},{
    timestamps: true
})

module.exports = model('bannerCategoria',bannerCategoria);