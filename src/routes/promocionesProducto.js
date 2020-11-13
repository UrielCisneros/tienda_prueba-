const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const { createPromocionMasiva, getPromocionMasiva ,editPromocionMasiva, promocionLimitante } = require('../controllers/promocionProductos.controllers');


router.route('/masiva/').get(getPromocionMasiva).post(createPromocionMasiva).put(editPromocionMasiva);

router.route('/limitante/').post(promocionLimitante)

module.exports = router;