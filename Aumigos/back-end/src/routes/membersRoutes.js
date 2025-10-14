const express = require('express');
const router = express.Router();

const getMembers = require('../controllers/membrosCrud/getMembers');
const createMember = require('../controllers/membrosCrud/createMember');
const updateMember = require('../controllers/membrosCrud/updateMembers');
const deleteMember = require('../controllers/membrosCrud/deleteMembers');

router.get('/', getMembers);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;
