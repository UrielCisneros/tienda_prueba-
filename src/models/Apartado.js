const { Schema, model } = require('mongoose');
const mongoodePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const ApartadoSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'producto'
    },
    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente'
    },
    cantidad: {
        type: Number,
        required: true
    },
    medida: [{
        talla: String,
        numero: String
    }],
    estado: {
        type: String,
        required: true
    },
    tipoEntrega: {
        type: String,
    },
    url:{
        type: String
    },
    paqueteria: {
        type: String
    },
    codigo_seguimiento: {
        type: String
    },
    mensajeUser: String,
    fecha_envio: {
        type: Date
    },
    eliminado: Boolean,
},
{
    timestamps: true
});

ApartadoSchema.plugin(mongoodePaginate);
ApartadoSchema.plugin(aggregatePaginate);

module.exports = model('apartado', ApartadoSchema);