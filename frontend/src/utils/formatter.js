export function formatRupiah(val) {
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    });

    return formatter.format(val);
}

export function formatTanggal(val) {
    console.log(val);
    const formattedDate = new Date(val).toLocaleDateString("id-ID", {
        dateStyle: "medium",
    });
    return formattedDate;
}
