const promocionCtrl = {};
const { exists } = require('../models/PromocionProducto');
const promocionModel = require('../models/PromocionProducto');
const productoModel = require('../models/Producto');


promocionCtrl.getPromocionMasiva = async (req,res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const options = {
            page,
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        }
        promocionModel.paginate({idProcionMasiva: exists}, options, (err, postStored) => {
            if (err) {
                res.status(500).json({ message: "Error en el servidor",err });
            } else {
                if (!postStored) {
                    res.status(400).json({ message: "Error al mostrar Blogs" })
                } else {
                    res.status(200).json({ posts: postStored });
                }
            }
        });
        const promociones = await promocionModel.find({});
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
}

function numerosAleatorios(){
    let aleatorios = "";
    for(i=0; i <= 9; i++){
        aleatorios+= Math.round(Math.random()*9);
    }
    return aleatorios;
}

promocionCtrl.createPromocionMasiva = (req,res) => {
    try {
        console.log(req.body);
        const {productos,descuento} = req.body;
        const aleatorio = numerosAleatorios()
        if(productos.length !== 0){
            productos.map( async (producto) => {
                const productoBase = await productoModel.findById(producto.idProducto);
                if(productoBase){
                    console.log(productoBase.precio);
                    const cantidadDescuento = productoBase.precio * parseFloat(`.${descuento}`);
                }
            })
        }

        res.status(200).json({message: "Si esta entrando"})
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
}

promocionCtrl.editPromocionMasiva = (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
}

promocionCtrl.promocionLimitante = (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
}


module.exports = promocionCtrl;