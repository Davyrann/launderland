import { createSignal, onMount, Show } from "solid-js";
import Loading from "../components/Loading.jsx";
import { get } from "../utils/api.js";
import { A } from "@solidjs/router";

import Plus from "../assets/svg/Plus.jsx";

export default function Dashboard() {
    const [pesanan, setPesanan] = createSignal();
    const [isLoading, setIsLoading] = createSignal(true);

    onMount(async () => {
        console.log(pesanan == true);
        const [res, err] = await get("pesanan");

        if (err) {
            alert("Ada kendala di server!");
            setPesanan([]);
            setIsLoading(false);
            return;
        }

        setPesanan(res.data);

        setIsLoading(false);
    });

    return (
        <main class="p-4 relative">
            <div class="max-w-4xl mx-auto flex flex-col h-full">
                <div class="my-4 mb-8 flex justify-between">
                    <h2 class="font-bold text-2xl">Dashboard</h2>
                    <A href="/buat-pesanan" class="btn btn-lprimary">
                        <Plus class="size-5" />
                        Pesanan Baru
                    </A>
                </div>

                <Show when={!isLoading()} fallback={<Loading />}>
                    <Show
                        when={pesanan().length}
                        fallback={
                            <div class="h-full flex flex-col justify-center items-center gap-4">
                                <p class="text-2xl italic">
                                    Tidak ada pesanan.
                                </p>
                                <A href="/buat-pesanan" class="btn btn-primary">
                                    Buat pesanan baru
                                </A>
                            </div>
                        }
                    >
                        <div class="overflow-x-auto">
                            <table class="table table-zebra border-2 border-black/20 shadow-md bg-white">
                                <thead class="bg-lprimary-600 text-white">
                                    <tr>
                                        <th>Resi</th>
                                        <th>Pelanggan</th>
                                        <th>Status</th>
                                        <th>Layanan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                    </tr>
                                    <tr>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                    </tr>
                                    <tr>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                        <td>Hlo</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Show>
                </Show>
            </div>
        </main>
    );
}
