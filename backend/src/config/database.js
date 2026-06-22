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
    
    const pesananCount = await db.get(`SELECT COUNT(*) as count FROM pesanan`)
    if (pesananCount.count === 0) {
        await db.exec(`
            INSERT INTO pesanan (no_resi, berat, total_harga, pelanggan_id, layanan_id, status_proses, status_pembayaran, metode_pembayaran, tanggal_masuk)
            `)
    }

    console.log('LaunderLand database initialized successfully.')
}

module.exports = { connectDB, initDB };