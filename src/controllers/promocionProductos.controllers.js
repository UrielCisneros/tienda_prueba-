const promocionCtrl = {};
const { exists } = require('../models/PromocionProducto');
const promocionModel = require('../models/PromocionProducto');
const productoModel = require('../models/Producto');
const util = require('util')
const sleep = util.promisify(setTimeout);


promocionCtrl.getPromocionMasiva = async (req,res) => {
    try {
        await promocionModel.aggregate([ {"$group" : {_id:"$idProcionMasiva"}}],async function (err, promociones){
			await promociones.forEach(async (item,index) => {
                arraypromociones = []
                console.log(item);
				if(promociones.lenght === (index + 1) ){
					return arraypromociones
				}else{
					if(item._id !== null){
                        const productosPromo = await promocionModel.find({idProcionMasiva: item._id });
                        console.log(productosPromo);
                        arraypromociones.push({
                            productosPromoMasiva: productosPromo
                        });
					   }
				}
			});
			await sleep(3000)
			if(arraypromociones.length !== 0){
				res.status(200).json(arraypromociones);
			} else {
				res.status(200).json([]);
			}
		});
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
        const { productos,descuento } = req.body;
        const aleatorio = numerosAleatorios();
        if(productos.length !== 0){
            productos.map( async (producto) => {
                const productoBase = await productoModel.findById(producto.idProducto);
                if(productoBase){
                    
                    const cantidadDescuento = parseFloat(productoBase.precio) * parseFloat(`.${descuento <= 9 ? `0${descuento}` : descuento}`);
                    const precioConDescuento = parseFloat(productoBase.precio) - parseFloat(cantidadDescuento);

                    const nuevaPromocion = new promocionModel(
                        {
                            productoPromocion: producto.idProducto,
                            precioPromocion: precioConDescuento,
                            idProcionMasiva: aleatorio
                        })
                    await nuevaPromocion.save();
                }
            })
        }
        res.status(200).json({message: "Promocion masiva agregada"});
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
}

promocionCtrl.editPromocionMasiva = async (req,res) => {
    try {
        console.log(req.body);
        const {idPromocionMasiva, descuento} = req.body;
        const productosPromo = await promocionModel.find({idProcionMasiva:idPromocionMasiva });
        if(productosPromo.length){
            productosPromo.map(async (producto) => {
                const productoBase = await productoModel.findById(producto.productoPromocion);
                const cantidadDescuento = parseFloat(productoBase.precio) * parseFloat(`.${descuento <= 9 ? `0${descuento}` : descuento}`);
                const precioConDescuento = parseFloat(productoBase.precio) - parseFloat(cantidadDescuento);
                const arrayPromocion = {
                    precioPromocion: precioConDescuento,
                }
                await promocionModel.findByIdAndUpdate(producto._id,arrayPromocion);
            })
        }
        
        console.log(productosPromo);
        res.status(200).json({message: "Promocion masiva editada"});
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