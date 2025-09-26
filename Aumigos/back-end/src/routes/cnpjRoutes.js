const express = require('express');
const router = express.Router();
const { getCnpj } = require('../controllers/cnpjController');

router.get("/:cnpj", getCnpj);

router.get('/', (req, res) => {
    res.send('Rota CNPJ funcionandoo!');
});
 module.exports = router;