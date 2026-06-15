const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const qrCode = require('qrcode')
const qrCodeTerminal = require('qrcode-terminal')

let waStatus = 'disconnected'
let waQrBase64 = null

// Client Init
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Mencegah error di beberapa OS
    }
});

// Event: QR Code Diminta
client.on('qr', async (qrText) => {
    try {
        // Ubah teks QR menjadi URL Gambar Base64
        waQrBase64 = await qrCode.toDataURL(qrText);
        waStatus = 'qr_ready';
        console.log('📌 [WA] QR Code Baru siap di-scan dari Frontend!');
        console.log('📌 Silakan Scan QR Code di bawah ini lewat WhatsApp:');
        qrCodeTerminal.generate(qrText, { small: true });
    } catch (err) {
        console.error('Gagal membuat gambar QR:', err);
    }
});

client.on('ready', () => {
    waStatus = 'connected';
    waQrBase64 = null; // Hapus gambar QR dari memori karena sudah login
    console.log('✅ [WA] WhatsApp Gateway Owner Aktif & Siap Tempur!');
});

client.on('disconnected', (reason) => {
    waStatus = 'disconnected';
    waQrBase64 = null;
    console.log('[WA] WhatsApp Terputus:', reason);
    client.initialize(); // Otomatis coba nyalakan lagi
});

const initWA = () => {
    console.log('[WA] Menyalakan mesin WhatsApp, mohon tunggu...');
    client.initialize();
};

const kirimPesanWhatapp = async (noHp, pesan, gambar64Base) => {
    if (waStatus !== 'connected') {
        console.warn('[WA] Tidak bisa mengirim pesan, status WA:', waStatus);
        return { success: false, message: 'WhatsApp belum terhubung. Pastikan sudah scan QR.' };
    }
    try {
        let cleanNumber = noHp.replace(/[-+ \s]/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '62' + cleanNumber.slice(1);
        }
        const numberId = await client.getNumberId(cleanNumber);
        if (!numberId) {
            console.log(`❌ [WA] Gagal kirim: Nomor ${noHp} tidak terdaftar di WhatsApp!`);
            return { success: false, message: 'Nomor tidak terdaftar di WhatsApp.' };
        }
        
        if (gambar64Base) {
            const mimeType = gambar64Base.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || 'image/png';
            const base64Data = gambar64Base.split(',')[1] || gambar64Base;
            const media = new MessageMedia(mimeType, base64Data, 'e-nota.png');

            await client.sendMessage(numberId._serialized, media, { caption: pesan });
            console.log(`[WA] Berhasil mengirim GAMBAR + CAPTION ke ${cleanNumber}`);
        } else {
            await client.sendMessage(numberId._serialized, pesan);
            console.log(`[WA] Berhasil mengirim TEKS ke ${cleanNumber}`);
        }
        
        return { success: true };
    
    } catch (error) {
        console.error('[WA] Gagal mengirim pesan:', error.message);
        return { success: false, message: 'Gagal mengirim pesan.' };
    }
}

const getWaStatus = () => ({ status: waStatus, qr: waQrBase64 });

module.exports = { initWA, kirimPesanWhatapp, getWaStatus };