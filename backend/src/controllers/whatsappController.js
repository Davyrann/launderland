const { getWaStatus, kirimPesanWhatapp } = require('../utils/whatsapp');

const cekStatusWA = (req, res) => {
    const status = getWaStatus();
    return res.json({
        message: "Status WhatsApp Gateway",
        data: status
    });
};

const kirimPesanWA = async (req, res) => {
    try {
        const { no_hp, pesan, url_media } = req.body;
        if (!no_hp || !pesan) {
            return res.status(400).json({ message: "Field 'no_hp' dan 'pesan' wajib diisi!" });
        }
        await kirimPesanWhatapp(no_hp, pesan, url_media);
        return res.json({ message: "Pesan WhatsApp berhasil dikirim!" });
    } catch (error) {
        console.error("Error mengirim pesan WhatsApp:", error);
        return res.status(500).json({ message: "Gagal mengirim pesan WhatsApp", error: error.message });
    }
}

module.exports = { cekStatusWA, kirimPesanWA };