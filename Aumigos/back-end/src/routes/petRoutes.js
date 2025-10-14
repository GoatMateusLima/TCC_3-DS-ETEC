const express = require('express');
const router = express.Router();

const createPet = require('../controllers/petCrud/createPet');
const getPets = require('../controllers/petCrud/getPets');
const updatePet = require('../controllers/petCrud/updatePet');
const deletePet = require('../controllers/petCrud/deletePet');
const { getPetById } = require('../controllers/petCrud/getPetById');

// CRUD
router.post('/', createPet);
router.get('/', getPets);
router.get('/:id', getPets);
router.get('/:id', getPetById);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
