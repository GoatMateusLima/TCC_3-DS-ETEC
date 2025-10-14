const express = require('express');
const router = express.Router();

const createAdocao = require('../controllers/adocaoCrud/createAdocao');
const getAdoacoes = require('../controllers/adocaoCrud/getAdoacoes');
const updateAdocao = require('../controllers/adocaoCrud/updateAdocao');
const deleteAdocao = require('../controllers/adocaoCrud/deleteAdocao');

router.post('/', createAdocao);
router.get('/', getAdoacoes);
router.put('/:id', updateAdocao);
router.delete('/:id', deleteAdocao);

module.exports = router;
