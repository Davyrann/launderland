export default function BuatPesanan() {
    function handleForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        console.log(formData);
    }

    return (
        <main class="h-full flex flex-col justify-center items-center">
            <div>
                <form onSubmit={handleForm}>
                    <fieldset class="fieldset bg-white border-base-300 rounded-box w-xs border p-4">
                        <legend class="fieldset-legend">Buat Pesanan</legend>

                        <label class="label">Nama Pelanggan</label>
                        <input
                            name="nama_pelanggan"
                            type="text"
                            class="input"
                            placeholder="John Doe"
                        />

                        <label class="label">Nama Pelanggan</label>
                        <input
                            name="no_hp"
                            type="number"
                            class="input"
                            placeholder="08123123123"
                        />

                        <label class="label">Layanan</label>
                        <select name="layanan_id" class="select">
                            <option value="Cuci Uang">Cuci Uang</option>
                        </select>

                        <label class="label">Berat Barang</label>
                        <input
                            name="berat"
                            type="number"
                            class="input"
                            placeholder="satuan (kg)"
                        />

                        <label class="label">Metode Pembayaran</label>
                        <select name="metode_pembayaran" class="select">
                            <option value="Tunai">Tunai</option>
                            <option value="Saldo">Saldo</option>
                        </select>

                        <button type="submit" class="btn btn-primary mt-4">
                            Buat Pesanan
                        </button>
                    </fieldset>
                </form>
            </div>
        </main>
    );
}
