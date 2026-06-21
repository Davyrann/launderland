const { listLayanan, buatLayanan, editLayanan, deleteLayanan } = require('../controllers/layananController');
const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /layanan:
 *   get:
 *     tags:
 *       - Layanan
 *     summary: Daftar layanan
 *     description: Mengambil semua layanan yang tersedia.
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar layanan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nama_layanan:
 *                     type: string
 *                   deskripsi:
 *                     type: string
 *                   harga:
 *                     type: number
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/', listLayanan);

/**
 * @swagger
 * /layanan:
 *   post:
 *     tags:
 *       - Layanan
 *     summary: Membuat layanan baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_layanan:
 *                 type: string
 *               deskripsi:   
 *                 type: string
 *               harga:
 *                 type: number
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - nama_layanan
 *               - deskripsi
 *               - harga
 *             properties:
 *               nama_layanan:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               harga:
 *                 type: number
 *     responses:
 *       201:
 *         description: Layanan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nama_layanan:
 *                   type: string
 *                 deskripsi:
 *                   type: string
 *                 harga:
 *                   type: number
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
 *                 error:
 *                   type: string
 */
router.post('/', buatLayanan);

/**
 * @swagger
 * /layanan/{id}:
 *   put:
 *     tags:
 *       - Layanan
 *     summary: Mengubah layanan
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
 *               nama_layanan:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               harga:
 *                 type: number
 *             example:
 *               nama_layanan: "Cuci Kiloan"
 *               deskripsi: "Cuci kering dengan harga per kilogram"
 *               harga: 7000
 *     responses:
 *       200:
 *         description: Layanan berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Layanan tidak ditemukan
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
 *                 error:
 *                   type: string
 */
router.put('/:id', editLayanan);

/**
 * @swagger
 * /layanan/{id}:
 *   delete:
 *     tags:
 *       - Layanan
 *     summary: Menghapus layanan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layanan berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Layanan tidak ditemukan
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
 *                 error:
 *                   type: string
 */
router.delete('/:id', deleteLayanan);

module.exports = router;