orderan = [
    {
        nama: "Budi",
        tanggalPesan: new Date(),
        pakaian: "",
    },
];

function tambahPesanan(event) {
    event.preventDefault();
    let formData = new FormData(event.target);

    let data = getLocalData();

    data.push({
        nama: formData.get("nama"),
        tanggalPesan: new Date(),
        pakaian: formData.get("pakaian"),
    });

    console.log(data);

    localStorage.setItem("data", JSON.stringify(data));
    window.location.href = "/";
}

function getLocalData() {
    let currentItem = localStorage.getItem("data");
    if (currentItem == undefined || currentItem == null) return [];

    return JSON.parse(currentItem);
}

function detailPesanan(tanggalPesan) {
    const data = getLocalData();
    let selectedPesanan = data.filter(
        (item) => item.tanggalPesan == tanggalPesan,
    )[0];

    const tglPesan = new Date(tanggalPesan);

    const namaEl = document.getElementById("nama");
    const pakaianEl = document.getElementById("pakaian");
    const tanggalEl = document.getElementById("tanggal-pesan");

    namaEl.innerHTML = selectedPesanan.nama;
    pakaianEl.innerHTML = selectedPesanan.pakaian;
    tanggalEl.innerHTML = tglPesan.toLocaleString("id-ID", {
        timeStyle: "short",
        dateStyle: "medium",
    });
}

function removePesanan(tanggalPesan) {
    const confirmed = confirm("Yakin?");
    if (!confirmed) return;

    let data = getLocalData();
    data = data.filter((item) => item.tanggalPesan != tanggalPesan);

    localStorage.setItem("data", JSON.stringify(data));
    refresh();
}

function refresh() {
    const listPesanan = document.getElementById("listPesanan");
    listPesanan.innerHTML = "";
    const data = getLocalData();

    data.forEach((item) => {
        listPesanan.innerHTML += `<div>
    <p class="grow">
        Orderan: <span class="font-bold">${item.nama}</span>
    </p>
    <button class="btn flex gap-2 text-sm items-center" onclick="window.location.href = '/detail.html?id=${item.tanggalPesan}'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
        Detail
    </button>
    <button class="btn flex gap-2 text-sm items-center" onclick="removePesanan('${item.tanggalPesan}')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" ><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>

        Selesai
    </button>
</div>`;
    });
}
