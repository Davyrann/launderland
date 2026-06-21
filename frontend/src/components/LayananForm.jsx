import { createSignal, onMount } from "solid-js";

export default function LayananForm({ handler, data }) {
    const [layananData, setLayananData] = createSignal({});
    const [submitting, setSubmitting] = createSignal(false);

    onMount(() => {
        if (data) setLayananData(data);
    });

    return (
        <form
            onSubmit={(event) => {
                setSubmitting(true);
                handler(event);
            }}
        >
            <fieldset class="fieldset bg-white border-base-300 rounded-box w-xs border p-4">
                <legend class="fieldset-legend">Buat Layanan</legend>

                <label class="label">Nama Layanan</label>
                <input
                    name="nama_layanan"
                    type="text"
                    class="input"
                    value={layananData() ? layananData().nama_layanan : ""}
                    placeholder="Cuci Uang"
                />

                <label class="label">Deskripsi</label>
                <textarea
                    name="deskripsi"
                    type="text"
                    placeholder="Mencuci uangmu 100% bebas pajak"
                    value={layananData() ? layananData().deskripsi : ""}
                    class="textarea"
                ></textarea>

                <label class="label">Harga (Rp)</label>
                <input
                    class="input"
                    name="harga"
                    type="number"
                    value={layananData() ? layananData().harga : ""}
                    placeholder="10000"
                />

                <button
                    disabled={submitting()}
                    type="submit"
                    class="btn btn-primary mt-4"
                >
                    Buat Layanan
                </button>
            </fieldset>
        </form>
    );
}
