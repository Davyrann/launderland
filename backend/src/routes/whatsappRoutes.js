const express = require('express');
const { cekStatusWA, kirimPesanWA } = require('../controllers/whatsappController');

const router = express.Router();

// Frontend memanggil GET /api/whatsapp/status secara berulang (polling)
router.get('/status', cekStatusWA);
router.post('/kirim', kirimPesanWA);

module.exports = router;