const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer em memória para lidar com uploads via FormData
const storage = multer.memoryStorage();
const upload = multer({ storage });

const createPet = require('../controllers/petCrud/createPet');
const getPets = require('../controllers/petCrud/getPets');
const updatePet = require('../controllers/petCrud/updatePet');
const deletePet = require('../controllers/petCrud/deletePet');
const { getPetById } = require('../controllers/petCrud/getPetById');

// CRUD
router.post('/', upload.single('imagem'), createPet);
router.get('/', getPets);
// GET by id -> encaminha para getPetById
router.get('/:id', getPetById);
router.put('/:id', upload.single('imagem'), updatePet);
router.delete('/:id', deletePet);

module.exports = router;
