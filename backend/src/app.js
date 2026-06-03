const express = require('express');
const cors = require('cors');

const { initDB } = require('./config/database');
const { initWA } = require('./utils/whatsapp');

const pesananRoutes = require('./routes/pesananRoutes');
const layananRoutes = require('./routes/layananRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/pesanan', pesananRoutes);
app.use('/api/layanan', layananRoutes);
app.use('/api/whatsapp', whatsappRoutes);


app.get('/api', (req, res) => {
    res.json({ message: "LaunderLand Tools Pembantu Owner Laundry Telah Berjalan" });
});

initDB().then(() => {
    initWA();
    app.listen(PORT, () => {
        console.log(`=================================================`);
        console.log(`Server Lokal LaunderLand Aktif di: http://localhost:${PORT}`);
        console.log(`=================================================`);
    });
}).catch(err => {
    console.error("Gagal menyalakan server karena database error:", err);
});
