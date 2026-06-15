const express = require('express');
const { getLaporanPendapatan } = require('../controllers/laporanController');

const router = express.Router();

/**
 * @swagger
 * /laporan/pendapatan:
 *   get:
 *     tags:
 *       - Laporan
 *     summary: Menampilkan rekapitulasi laporan pendapatan laundry
 *     description: Mengambil data omzet, total berat, dan daftar transaksi lunas berdasarkan rentang tanggal.
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal awal (Format YYYY-MM-DD), Contoh 2026-06-01
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal akhir (Format YYYY-MM-DD), Contoh 2026-06-30
 *     responses:
 *       200:
 *         description: Berhasil memuat data laporan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data laporan berhasil ditarik"
 *                 filter:
 *                   type: object
 *                   properties:
 *                     tanggal_awal:
 *                       type: string
 *                       example: "2026-06-01"
 *                     tanggal_akhir:
 *                       type: string
 *                       example: "2026-06-30"
 *                 data:
 *                   type: object
 *                   properties:
 *                     ringkasan:
 *                       type: object
 *                       properties:
 *                         total_pesanan:
 *                           type: integer
 *                           example: 12
 *                         total_berat:
 *                           type: number
 *                           example: 45.5
 *                         total_omzet:
 *                           type: number
 *                           example: 1250000
 *                     rincian:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           no_resi:
 *                             type: string
 *                             example: "RESI-ABC123"
 *                           tanggal_masuk:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-06-15T08:30:00Z"
 *                           berat:
 *                             type: number
 *                             example: 3.5
 *                           total_harga:
 *                             type: number
 *                             example: 35000
 *                           metode_pembayaran:
 *                             type: string
 *                             example: "Tunai"
 *                           nama_layanan:
 *                             type: string
 *                             example: "Cuci Kiloan"
 *                           nama_pelanggan:
 *                             type: string
 *                             example: "Budi"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get('/pendapatan', getLaporanPendapatan);

module.exports = router;