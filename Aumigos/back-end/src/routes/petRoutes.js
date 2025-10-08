const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const createPet = require('../controllers/petCrud/createPet');
const { deletePet } = require('../controllers/petCrud/deletePet');
const  getPets  = require('../controllers/petCrud/getPets');
const { getPetById } = require('../controllers/petCrud/getPetById');
const { updatePet } = require('../controllers/petCrud/updatePet');

router.post('/', upload.single('image'), createPet);
router.get('/', getPets);
router.get('/:id', getPetById);
router.put('/:id', upload.single('image'), updatePet);
router.delete('/:id', deletePet);

module.exports = router;