const express = require('express');
const router = express.Router();

const createOng = require('../controllers/ongCrud/createOng');
const getOng = require('../controllers/ongCrud/getOng');
const updateOng = require('../controllers/ongCrud/updateOng');
const deleteOng = require('../controllers/ongCrud/deleteOng');

// CRUD
router.post('/', createOng);
router.get('/', getOng);
router.get('/:id', getOng);
router.put('/:id', updateOng);
router.delete('/:id', deleteOng);

module.exports = router;