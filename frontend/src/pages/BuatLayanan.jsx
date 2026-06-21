import { redirect, useNavigate } from "@solidjs/router";
import { post } from "../utils/api";

export default function BuatLayanan() {
    const navigate = useNavigate();

    async function handleForm(event) {
        event.preventDefault();
        let formData = new FormData(event.target);

        const [res, err] = await post("layanan", formData);
        if (err) {
            alert(err);
            return;
        }

        navigate("/layanan");
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

                        <label class="label">Deskripsi</label>
                        <textarea
                            name="deskripsi"
                            type="text"
                            placeholder="Mencuci uangmu 100% bebas pajak"
                            class="textarea"
                        ></textarea>

                        <label class="label">Harga (Rp)</label>
                        <input
                            class="input"
                            name="harga"
                            type="number"
                            placeholder="10000"
                        />

                        <button type="submit" class="btn btn-primary mt-4">
                            Buat Layanan
                        </button>
                    </fieldset>
                </form>
            </div>
        </main>
    );
}
