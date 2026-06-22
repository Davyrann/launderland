export function formatRupiah(val) {
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    });

    return formatter.format(val);
}

export function formatTanggal(val) {
    const formattedDate = new Date(val).toLocaleDateString("id-ID", {
        dateStyle: "medium",
    });
    return formattedDate;
}

export function hitungRevenueSampaiHariIni(data) {
    const formatDate = (date) => {
        const d = new Date(date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    // Step 1: Akumulasi data transaksi ke dalam object map
    const mapRevenue = data.reduce((acc, item) => {
        const tglKey = formatDate(item.date);
        acc[tglKey] = (acc[tglKey] || 0) + item.price;
        return acc;
    }, {});

    const hasilMingguan = [];

    // Step 2: Hitung mundur 6 hari dari sekarang agar hari ini jadi hari ke-7
    const hariIni = new Date();
    const tanggalMulai = new Date(hariIni);
    tanggalMulai.setDate(hariIni.getDate() - 6);

    // Step 3: Loop 7 kali untuk generates data dari 6 hari lalu sampai HARI INI
    for (let i = 0; i < 7; i++) {
        const targetDate = new Date(tanggalMulai);
        targetDate.setDate(tanggalMulai.getDate() + i);

        const tglStr = formatDate(targetDate);

        hasilMingguan.push({
            date: tglStr,
            totalPrice: mapRevenue[tglStr] || 0,
        });
    }

    return hasilMingguan;
}
