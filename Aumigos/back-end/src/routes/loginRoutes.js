// src/routes/loginRoutes.js
const express = require('express');
const router = express.Router();

const { login } = require('../controllers/loginController');

router.post('/', login); // 🚨 função passada sem parênteses

module.exports = router;
