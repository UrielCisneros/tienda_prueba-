const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const {subirImagen,createBanner,getBanners,editBanner,deleteBanner,eliminarImagen} = require('../controllers/bannerCategoria');

router.route('/')
    .get(getBanners)
    .post(auth,subirImagen,createBanner)

router.route('/:idBanner')
    .put(auth,subirImagen,editBanner)
    .delete(auth,deleteBanner)

router.route('/imagen/:idBanner').delete(auth,eliminarImagen);


module.exports = router;