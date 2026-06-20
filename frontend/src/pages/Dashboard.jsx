import { createSignal, onMount, Show } from "solid-js";
import Loading from "../components/Loading.jsx";
import { get } from "../utils/api.js";
import { A } from "@solidjs/router";

export default function Dashboard() {
    const [pesanan, setPesanan] = createSignal();
    const [isLoading, setIsLoading] = createSignal(true);

    onMount(async () => {
        console.log(pesanan == true);
        const [res, err] = await get("pesanan");

        setPesanan(res.data);

        setIsLoading(false);
    });

    return (
        <main class="p-4">
            <div class="max-w-4xl mx-auto flex flex-col h-full">
                <h2 class="font-semibold text-2xl mb-4">
                    Selamat datang di LaunderLand!
                </h2>

                <Show
                    when={!isLoading()}
                    fallback={
                        <div class="flex justify-center items-center grow">
                            <Loading class="size-1/2 md:size-1/4" />
                        </div>
                    }
                >
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
                                <thead class="bg-pink-600 text-white">
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
