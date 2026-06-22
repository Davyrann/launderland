const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const connectDB = async () => {
    return open({
        filename: './LL.db',
        driver: sqlite3.Database
    })
}

const initDB = async () => {
    const db = await connectDB();
    
    // 1. Buat Tabel-tabel utama jika belum ada
    await db.exec(`
        CREATE TABLE IF NOT EXISTS layanan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama_layanan TEXT NOT NULL,
            deskripsi TEXT,
            harga REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pelanggan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            no_hp TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pesanan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            no_resi TEXT UNIQUE NOT NULL,
            berat REAL NOT NULL,
            total_harga REAL NOT NULL,
            status_proses TEXT DEFAULT 'antri',
            status_pembayaran TEXT DEFAULT 'belum_lunas',
            metode_pembayaran TEXT DEFAULT 'tunai',
            tanggal_masuk DATETIME DEFAULT CURRENT_TIMESTAMP,
            pelanggan_id INTEGER,
            layanan_id INTEGER,
            FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id),
            FOREIGN KEY (layanan_id) REFERENCES layanan(id)
        );
    `);

    const layananCount = await db.get(`SELECT COUNT(*) as count FROM layanan`);
    if (layananCount.count === 0) {
        await db.exec(`
            INSERT INTO layanan (nama_layanan, deskripsi, harga) VALUES 
            ('Cuci Kering', 'Cuci kering dengan harga per kilogram', 10000),
            ('Cuci Setrika', 'Cuci dan setrika', 15000),
            ('Setrika Saja', 'Setrika saja', 8000);
        `);
    }
    
    // 2. Seed pelanggan jika kosong
    const pelangganCount = await db.get(`SELECT COUNT(*) as count FROM pelanggan`);
    if (pelangganCount.count === 0) {
        await db.exec(`
            INSERT INTO pelanggan (nama, no_hp) VALUES
            ('Budi Santoso', '081234567890'),
            ('Siti Rahma', '081234567891'),
            ('Dewi Lestari', '081234567892'),
            ('Joko Anwar', '081234567893'),
            ('Andi Wijaya', '081234567894');
        `);
    }

    const pelangganList = await db.all(`SELECT id FROM pelanggan`);
    const layananList = await db.all(`SELECT id, harga FROM layanan`);

    const pesananCount = await db.get(`SELECT COUNT(*) as count FROM pesanan`);
    if (pesananCount.count === 0) {
        const statusesProses = ['antri', 'proses', 'selesai', 'diambil'];
        const metodesPembayaran = ['Tunai', 'Saldo'];

        for (let i = 6; i >= 0; i--) {
            // Minimal 4 pesanan, random antara 4 dan 8 pesanan per hari
            const totalPesananHariIni = Math.floor(Math.random() * 5) + 4;

            for (let j = 0; j < totalPesananHariIni; j++) {
                const pelanggan = pelangganList[Math.floor(Math.random() * pelangganList.length)];
                const layanan = layananList[Math.floor(Math.random() * layananList.length)];
                
                const noResi = `RESI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                const berat = parseFloat((Math.random() * 8 + 1).toFixed(1)); // 1.0 s.d 9.0 kg
                const totalHarga = berat * layanan.harga;
                
                const metodePembayaran = metodesPembayaran[Math.floor(Math.random() * metodesPembayaran.length)];
                // Jika Saldo -> lunas, jika Tunai -> bisa lunas atau belum lunas
                const statusPembayaran = metodePembayaran === 'Saldo' ? 'lunas' : (Math.random() > 0.5 ? 'lunas' : 'belum lunas');
                
                const statusProses = statusesProses[Math.floor(Math.random() * statusesProses.length)];

                // Hitung tanggal masuk ter-randomisasi di hari ke-i yang lalu
                const tanggal = new Date();
                tanggal.setDate(tanggal.getDate() - i);
                tanggal.setHours(Math.floor(Math.random() * 12) + 8); // Jam 08:00 - 20:00
                tanggal.setMinutes(Math.floor(Math.random() * 60));
                tanggal.setSeconds(Math.floor(Math.random() * 60));
                
                const tanggalMasuk = tanggal.toISOString().replace('T', ' ').substring(0, 19);

                await db.run(`
                    INSERT INTO pesanan (no_resi, berat, total_harga, status_proses, status_pembayaran, metode_pembayaran, tanggal_masuk, pelanggan_id, layanan_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [noResi, berat, totalHarga, statusProses, statusPembayaran, metodePembayaran, tanggalMasuk, pelanggan.id, layanan.id]);
            }
        }
        console.log('Dummy data generate.');
    }

    console.log('LaunderLand database initialized successfully.')
}

module.exports = { connectDB, initDB };