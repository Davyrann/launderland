import { post } from "../utils/api";

export default function BuatLayanan() {
    async function handleForm(event) {
        event.preventDefault();
        let formData = new FormData(event.target);

        const [res, err] = post("layanan", formData);
        if (err) {
            alert(err);
            return;
        }

        console.log(res);
    }

    return (
        <main class="h-full flex flex-col justify-center items-center">
            <div>
                <form onSubmit={handleForm}>
                    <fieldset class="fieldset bg-white border-base-300 rounded-box w-xs border p-4">
                        <legend class="fieldset-legend">Buat Layanan</legend>

                        <label class="label">Nama Layanan</label>
                        <input
                            name="nama_layanan"
                            type="text"
                            class="input"
                            placeholder="Cuci Uang"
                        />

                        <label class="label">Harga (Rp)</label>
                        <input
                            class="input"
                            name="harga"
                            type="number"
                            placeholder="10000"
                        />

                        <button type="submit" class="btn btn-primary mt-4">
                            Buat Pesanan
                        </button>
                    </fieldset>
                </form>
            </div>
        </main>
    );
}
