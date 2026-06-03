const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const { initDB } = require('./config/database');
const { initWA } = require('./utils/whatsapp');

const pesananRoutes = require('./routes/pesananRoutes');
const layananRoutes = require('./routes/layananRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const laporanRoutes = require('./routes/laporanRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LaunderLand API Documentation',
            version: '1.0.0',
            description: 'Dokumentasi API interaktif untuk Sistem Kasir Laundry LaunderLand',
            contact: {
                name: 'Davyran'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Server Lokal (Development)'
            }
        ]
    },
    // Menunjuk ke lokasi file yang akan kita tulisi dokumentasinya
    apis: ['./src/routes/*.js'] 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/pesanan', pesananRoutes);
app.use('/api/layanan', layananRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/laporan', laporanRoutes);


app.get('/api', (req, res) => {
    res.json({ message: "LaunderLand Tools Pembantu Owner Laundry Telah Berjalan" });
});

initDB().then(() => {
    initWA();
    app.listen(PORT, () => {
        console.log(`=================================================`);
        console.log(`Server Lokal LaunderLand Aktif di: http://localhost:${PORT}`);
        console.log(`Dokumentasi API tersedia di: http://localhost:${PORT}/api-docs`);
        console.log(`=================================================`);
        
    });
}).catch(err => {
    console.error("Gagal menyalakan server karena database error:", err);
});
