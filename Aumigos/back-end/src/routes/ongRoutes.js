const express = require('express'); 
const router = express.Router();
const getOng = require('../controllers/ongCrud/getOng');

router.get('/', getOng);

module.exports = router;