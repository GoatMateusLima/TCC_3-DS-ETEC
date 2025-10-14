const express = require('express');
const router = express.Router();

const createAdotante = require('../controllers/adotanteCrud/createAdotante');
const getAdotantes = require('../controllers/adotanteCrud/getAdotantes');
const updateAdotante = require('../controllers/adotanteCrud/updateAdotante');
const deleteAdotante = require('../controllers/adotanteCrud/deleteAdotante');

// CRUD
router.post('/', createAdotante);
router.get('/', getAdotantes);
router.get('/:id', getAdotantes);
router.put('/:id', updateAdotante);
router.delete('/:id', deleteAdotante);

module.exports = router;