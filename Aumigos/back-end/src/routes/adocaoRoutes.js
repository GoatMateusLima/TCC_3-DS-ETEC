const express = require('express');
const router = express.Router();

const createAdocao = require('../controllers/adocaoCrud/createAdocao');
const getAdocao = require('../controllers/adocaoCrud/getAdoacoes');
const updateAdocao = require('../controllers/adocaoCrud/updateAdocao');
const deleteAdocao = require('../controllers/adocaoCrud/deleteAdocao');

router.post('/', createAdocao);         // POST /adocao
router.get('/', getAdocao);             // GET  /adocao
router.get('/:id', getAdocao);          // GET  /adocao/:id
router.put('/:id', updateAdocao);       // PUT  /adocao/:id
router.delete('/:id', deleteAdocao);    // DELETE /adocao/:id

module.exports = router;
