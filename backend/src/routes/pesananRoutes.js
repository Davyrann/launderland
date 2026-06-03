const express = require('express');
const { buatPesanan, updateStatus, listPesanan, detailPesanan, updateStatusPembayaran } = require('../controllers/pesananController');

const router = express.Router();

router.post('/', buatPesanan);
router.get('/', listPesanan);
router.get('/:id', detailPesanan);
router.patch('/:id/status', updateStatus);
router.put('/:no_resi/bayar', updateStatusPembayaran);

module.exports = router;