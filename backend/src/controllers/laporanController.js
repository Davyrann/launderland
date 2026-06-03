const { connectDB } = require('../config/database');

const getLaporanPendapatan = async (req, res) => {
    try {
        const { start, end } = req.query;
        const db = await connectDB();

        let querySummary = `
            SELECT 
                COUNT(id) as total_pesanan,
                COALESCE(SUM(berat), 0) as total_berat,
                COALESCE(SUM(total_harga), 0) as total_omzet
            FROM pesanan 
            WHERE status_pembayaran = 'lunas'
        `;

        let queryList = `
            SELECT p.no_resi, p.tanggal_masuk, p.berat, p.total_harga, p.metode_pembayaran, l.nama_layanan, pl.nama as nama_pelanggan
            FROM pesanan p
            JOIN layanan l ON p.layanan_id = l.id
            JOIN pelanggan pl ON p.pelanggan_id = pl.id
            WHERE p.status_pembayaran = 'lunas'
        `;

        const queryParams = [];

        if (start && end) {
            // Gunakan fungsi date() SQLite agar format datetime bisa dibandingkan dengan aman
            const dateFilter = ` AND date(p.tanggal_masuk) BETWEEN date(?) AND date(?)`;
            querySummary += ` AND date(tanggal_masuk) BETWEEN date(?) AND date(?)`;
            queryList += dateFilter;
            queryParams.push(start, end);
        }
        
        queryList += ` ORDER BY p.tanggal_masuk DESC`; // Urutkan dari yang terbaru
    
        const [summary, listPesanan] = await Promise.all([
            db.get(querySummary, queryParams),
            db.all(queryList, queryParams)
        ]);

        return res.json({
            message: "Data laporan berhasil ditarik",
            filter: {
                tanggal_awal: start || "Semua waktu",
                tanggal_akhir: end || "Semua waktu"
            },
            data: {
                ringkasan: summary,
                rincian: listPesanan
            }
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports = { getLaporanPendapatan };