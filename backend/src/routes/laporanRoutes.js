const express = require('express');
const { getLaporanPendapatan } = require('../controllers/laporanController');

const router = express.Router();

router.get('/pendapatan', getLaporanPendapatan);

module.exports = router;