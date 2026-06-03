const express = require('express');
const { cekStatusWA, kirimPesanWA } = require('../controllers/whatsappController');

const router = express.Router();

/**
 * @swagger
 * /whatsapp/status:
 *   get:
 *     tags:
 *       - WhatsApp
 *     summary: Cek status WhatsApp Gateway
 *     description: Mengambil status koneksi gateway WhatsApp untuk polling dari frontend.
 *     responses:
 *       200:
 *         description: Berhasil mengambil status WA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "connected"
 *                     qr:
 *                       type: string
 *                       nullable: true
 *                       example: null
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
// Frontend memanggil GET /api/whatsapp/status secara berulang (polling)
router.get('/status', cekStatusWA);

/**
 * @swagger
 * /whatsapp/kirim:
 *   post:
 *     tags:
 *       - WhatsApp
 *     summary: Mengirim pesan WhatsApp manual
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - no_hp
 *               - pesan
 *             properties:
 *               no_hp:
 *                 type: string
 *               pesan:
 *                 type: string
 *               url_media:
 *                 type: string
 *                 description: URL media opsional untuk dikirim bersama pesan
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - no_hp
 *               - pesan
 *             properties:
 *               no_hp:
 *                 type: string
 *                 example: "081234567890"
 *               pesan:
 *                 type: string
 *                 example: "Halo, pesanan sudah siap diambil."
 *               url_media:
 *                 type: string
 *                 description: URL media opsional untuk dikirim bersama pesan
 *             example:
 *               no_hp: "081234567890"
 *               pesan: "Halo, pesanan sudah siap diambil."
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               no_hp:
 *                 type: string
 *               pesan:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Lampirkan file media jika ingin mengirim gambar
 *     responses:
 *       200:
 *         description: Pesan berhasil dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Input tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
router.post('/kirim', kirimPesanWA);

module.exports = router;