const {Schema,model} = require('mongoose');

const estadosModel = new Schema({
    estado: String,
    municipios: [{
        municipio: String,
        cp: String
    }]
})

module.exports = model('estados',estadosModel);

