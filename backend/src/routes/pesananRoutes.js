const express = require('express');
const { buatPesanan, updateStatus, listPesanan, detailPesanan, updateStatusPembayaran } = require('../controllers/pesananController');

const router = express.Router();

/**
 * @swagger
 * /pesanan:
 *   post:
 *     tags:
 *       - Pesanan
 *     summary: Membuat pesanan baru
 *     description: Membuat pesanan dan upsert pelanggan berdasarkan nomor HP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - no_hp
 *               - nama_pelanggan
 *               - layanan_id
 *               - berat
 *               - metode_pembayaran
 *             properties:
 *               no_hp:
 *                 type: string
 *               nama_pelanggan:
 *                 type: string
 *               layanan_id:
 *                 type: integer
 *               berat:
 *                 type: number
 *               metode_pembayaran:
 *                 type: string
 *                 enum:
 *                   - Tunai
 *                   - QRIS
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - no_hp
 *               - nama_pelanggan
 *               - layanan_id
 *               - berat
 *               - metode_pembayaran
 *             properties:
 *               no_hp:
 *                 type: string
 *                 example: "081234567890"
 *               nama_pelanggan:
 *                 type: string
 *                 example: "Budi"
 *               layanan_id:
 *                 type: integer
 *                 example: 1
 *               berat:
 *                 type: number
 *                 example: 3.5
 *               metode_pembayaran:
 *                 type: string
 *                 enum:
 *                   - Tunai
 *                   - QRIS
 *     responses:
 *       201:
 *         description: Pesanan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pesanan berhasil dibuat!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     no_resi:
 *                       type: string
 *                       example: "RESI-ABC123"
 *                     total_harga:
 *                       type: number
 *                       example: 50000
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
router.post('/', buatPesanan);

/**
 * @swagger
 * /pesanan:
 *   get:
 *     tags:
 *       - Pesanan
 *     summary: Daftar pesanan
 *     description: Mengambil daftar seluruh pesanan untuk dashboard.
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar pesanan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       no_resi:
 *                         type: string
 *                       berat:
 *                         type: number
 *                       total_harga:
 *                         type: number
 *                       status_proses:
 *                         type: string
 *                       status_pembayaran:
 *                         type: string
 *                       tanggal_masuk:
 *                         type: string
 *                       nama_pelanggan:
 *                         type: string
 *                       nama_layanan:
 *                         type: string
 *       500:
 *         description: Server Error
 */
router.get('/', listPesanan);

/**
 * @swagger
 * /pesanan/{id}:
 *   get:
 *     tags:
 *       - Pesanan
 *     summary: Detail pesanan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail pesanan
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
 *                     id:
 *                       type: integer
 *                     no_resi:
 *                       type: string
 *                     berat:
 *                       type: number
 *                     total_harga:
 *                       type: number
 *                     status_proses:
 *                       type: string
 *                     status_pembayaran:
 *                       type: string
 *                     tanggal_masuk:
 *                       type: string
 *                     nama_pelanggan:
 *                       type: string
 *                     no_hp:
 *                       type: string
 *                     nama_layanan:
 *                       type: string
 *                     harga_layanan:
 *                       type: number
 *       404:
 *         description: Pesanan tidak ditemukan
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
router.get('/:id', detailPesanan);

/**
 * @swagger
 * /pesanan/{id}/status:
 *   patch:
 *     tags:
 *       - Pesanan
 *     summary: Update status proses pesanan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_proses:
 *                 type: string
 *                 enum:
 *                   - antri
 *                   - proses
 *                   - selesai
 *                   - diambil
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               status_proses:
 *                 type: string
 *                 enum:
 *                   - antri
 *                   - proses
 *                   - selesai
 *                   - diambil
 *             example:
 *               status_proses: "selesai"
 *     responses:
 *       200:
 *         description: Status berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Pesanan tidak ditemukan
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
router.patch('/:id/status', updateStatus);

/**
 * @swagger
 * /pesanan/{no_resi}/bayar:
 *   put:
 *     tags:
 *       - Pesanan
 *     summary: Tandai pembayaran lunas berdasarkan nomor resi
 *     parameters:
 *       - in: path
 *         name: no_resi
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pembayaran berhasil dicatat sebagai lunas
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
 *                     no_resi:
 *                       type: string
 *                     status_pembayaran:
 *                       type: string
 *       404:
 *         description: Pesanan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Pesanan sudah lunas
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
router.put('/:no_resi/bayar', updateStatusPembayaran);

module.exports = router;