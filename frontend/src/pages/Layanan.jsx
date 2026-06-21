import { createSignal, For, onMount, Show } from "solid-js";
import { get } from "../utils/api";
import Loading from "../components/Loading.jsx";
import Pencil from "../assets/svg/Pencil.jsx";
import Plus from "../assets/svg/Plus.jsx";
import { A } from "@solidjs/router";

export default function Layanan() {
    const [isLoading, setIsLoading] = createSignal(true);
    const [layanan, setLayanan] = createSignal([]);

    onMount(async () => {
        const [res, err] = await get("layanan");
        if (err) {
            console.log(err);
            return;
        }

        console.log(res);
        setLayanan(res);
        setIsLoading(false);
    });

    function formatRupiah(val) {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        });

        return formatter.format(val);
    }

    return (
        <main class="p-4 relative">
            <div class="max-w-4xl mx-auto flex flex-col h-full overflow-auto">
                <div class="my-4 mb-8 flex justify-between">
                    <h2 class="font-bold text-2xl">Daftar Layanan</h2>
                    <A href="/buat-layanan" class="btn btn-lprimary">
                        <Plus class="size-5" />
                        Tambah Layanan
                    </A>
                </div>
                <Show when={!isLoading()} fallback={<Loading />}>
                    <div class="grid grid-cols-2 gap-4">
                        <For each={layanan()}>
                            {(item, index) => (
                                <div class="border rounded-md border-black/20 p-4 bg-white shadow-md flex flex-col gap-4">
                                    <div class="flex flex-col sm:flex-row justify-between items-center">
                                        <p class="font-semibold text-xl text-center">
                                            {item.nama_layanan}
                                        </p>
                                        <p class="text-success text-center font-semibold">
                                            {formatRupiah(item.harga)}
                                        </p>
                                    </div>
                                    <p class="grow">{item.deskripsi}</p>
                                    <A
                                        href="/edit-layanan"
                                        state={item}
                                        class="btn btn-primary w-full mt-2"
                                    >
                                        <Pencil class="size-6" />
                                        Edit
                                    </A>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </main>
    );
}
