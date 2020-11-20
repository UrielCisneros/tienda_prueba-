const politicasCtrl = {};
const politicasModel = require('../models/PoliticasEnvio');

politicasCtrl.getPoliticas = async (req, res) => {
	try {
		const politicas = await politicasModel.find().populate("idTienda").populate("idAdministrador");
		res.json(politicas[0]);
	} catch (err) {
		res.status(500).json({ message: "Error en el servidor",err })	
	}

};

politicasCtrl.createPoliticas = async (req,res) => {
    try {
        const newPolticas = new politicasModel(req.body);
        console.log(req.body)
        newPolticas.save((err, userStored) => {
            if (err) {
                res.status(500).json({ message: 'Ups, algo paso al registrar el usuario',err });
            } else {
                res.status(200).json({ message: 'Politicas Registradas',userStored });
            }
        });
        
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.updatePoliticas = async (req,res) => {
    try {
        await politicasModel.findByIdAndUpdate(req.params.id,req.body,(err, userStored) => {
            if (err) {
                res.status(500).json({ message: 'Ups, algo paso al registrar el usuario',err });
            } else {
                res.status(200).json({ message: 'Politicas Actualizadas' });
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.getEstados = async (req,res) => {
    try {
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.createEstados = async (req,res) => {
    try {
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.editEstados = async (req,res) => {
    try {
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.deleteEstados = async (req,res) => {
    try {
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err })
    }
}




module.exports = politicasCtrl;