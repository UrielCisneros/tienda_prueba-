const {Schema,model} = require('mongoose');

const estadosModel = new Schema({
    estado: String,
    municipios: [{
        municipio: String
    }]
})

module.exports = model('estados',estadosModel);

