const { listLayanan, buatLayanan, editLayanan, deleteLayanan } = require('../controllers/layananController');
const express = require('express');

const router = express.Router();

router.get('/', listLayanan);
router.post('/', buatLayanan);
router.put('/:id', editLayanan);
router.delete('/:id', deleteLayanan);

module.exports = router;