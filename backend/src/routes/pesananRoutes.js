const express = require('express');
const { buatPesanan, updateStatus, listPesanan, detailPesanan } = require('../controllers/pesananController');

const router = express.Router();

router.post('/', buatPesanan);
router.get('/', listPesanan);
router.get('/:id', detailPesanan);
router.patch('/:id/status', updateStatus);

module.exports = router;