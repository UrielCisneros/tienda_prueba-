const { Router } = require('express');
const router = Router();

const { 
    crearTienda,
    obtenerTienda,
    actualizarTienda,
    eliminarTienda,
    subirImagen
} = require('../controllers/tienda.controllers');
const auth = require('../middleware/auth');

router.route('/')
    .post(auth,subirImagen,crearTienda)
    .get(obtenerTienda)

router.route('/:idTienda')
    .put(auth,subirImagen,actualizarTienda)
    .delete(auth,eliminarTienda)

module.exports = router;