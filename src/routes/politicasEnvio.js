const { Router } = require('express');
const router = Router();
const { getPoliticas,createPoliticas,updatePoliticas,getEstados,createEstados,editEstados } = require('../controllers/politicasEnvio.controllers');
const auth = require('../middleware/auth');

router.route('/')
    .get(getPoliticas)//Get all admin dates
    .post(auth,createPoliticas);//Add a admin 


router.route('/:id')
    .put(auth,updatePoliticas)//Update a admin

router.route('/estados/').post(createEstados).get(getEstados).put(editEstados)

module.exports = router;