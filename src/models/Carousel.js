const { Schema, model } = require('mongoose');

const CarouselSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'producto'
    },
    imagen: String
},
{
    timestamps: true
});

module.exports = model('carousel', CarouselSchema);