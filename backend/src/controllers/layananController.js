const { connectDB } = require('../config/database');

const listLayanan = async (req, res) => {
    try {
        const db = await connectDB();
        const layanan = await db.all('SELECT * FROM layanan');
        res.json(layanan);
    } catch (error) {
        console.error('Error fetching layanan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const buatLayanan = async (req, res) => {
    try {
        const db = await connectDB();
        const { nama_layanan, deskripsi, harga } = req.body;

        if (!nama_layanan) {
            return res.status(400).json({ error: 'Field \'nama_layanan\' harus diisi' });
        
        } else if (!deskripsi) {
            return res.status(400).json({ error: 'Field \'deskripsi\' harus diisi' });
        
        } else if (harga === undefined || isNaN(harga) || harga < 0) {
            return res.status(400).json({ error: 'Field \'harga\' harus berupa angka positif' });
        }
        
        const result = await db.run('INSERT INTO layanan (nama_layanan, deskripsi, harga) VALUES (?, ?, ?)', [nama_layanan, deskripsi, harga]);
        res.status(201).json({ id: result.lastID, nama_layanan, deskripsi, harga });
    } catch (error) {
        console.error('Error creating layanan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editLayanan = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        const { nama_layanan, deskripsi, harga } = req.body;
        
        if (!nama_layanan) {
            return res.status(400).json({ error: 'Field \'nama_layanan\' harus diisi' });
        
        } else if (!deskripsi) {
            return res.status(400).json({ error: 'Field \'deskripsi\' harus diisi' });
        
        } else if (harga === undefined || isNaN(harga) || harga < 0) {
            return res.status(400).json({ error: 'Field \'harga\' harus berupa angka positif' });
        }
        
        await db.run('UPDATE layanan SET nama_layanan = ?, deskripsi = ?, harga = ? WHERE id = ?', [nama_layanan, deskripsi, harga, id]);
        
        res.json({ message: 'Layanan updated successfully' });
    } catch (error) {
        console.error('Error updating layanan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteLayanan = async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Parameter \'id\' harus diisi' });
        }
        await db.run('DELETE FROM layanan WHERE id = ?', [id]);
        res.json({ message: 'Layanan deleted successfully' });
    } catch (error) {
        console.error('Error deleting layanan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { listLayanan, buatLayanan, editLayanan, deleteLayanan };