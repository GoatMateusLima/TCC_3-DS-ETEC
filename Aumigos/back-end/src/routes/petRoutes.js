const express = require('express');
const multer = require('multer');

const {createPet}  = require('../controllers/petCrud/createPet');
const  {deletePet}  = require('../controllers/petCrud/deletePet');
const {getPets} = require('../controllers/petCrud/getPets');
const {getPetById} = require('../controllers/petCrud/getPetById');
const {updatePet} = require('../controllers/petCrud/updatePet');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage()});

router.post('/', upload.single('image'), createPet);
router.get('/', getPets);
router.get('/:id', getPetById);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;