import { createEffect, createSignal, For, on, onMount, Show } from "solid-js";

import { get } from "../utils/api.js";
import { formatTanggal } from "../utils/formatter.js";

import Loading from "../components/Loading.jsx";

export default function Laporan() {
    let chartRef;

    const ALL_RENTANG = {
        Semua: 0,
        "1 Hari": 1,
        "7 Hari": 7,
        "1 Bulan": 30,
        "3 Bulan": 90,
        "6 Bulan": 180,
    };

    const [isLoading, setIsLoading] = createSignal(true);
    const [rentang, setRentang] = createSignal(30); // per hari

    createEffect(
        on(rentang, async (currentRentang, oldRentang) => {
            let getUrl = "laporan/pendapatan";

            if (rentang() != 0) {
                const today = new Date();
                const setelahRentang = new Date();
                setelahRentang.setDate(today.getDate() - currentRentang);

                getUrl =
                    "laporan/pendapatan?start=" +
                    setelahRentang.toISOString() +
                    "&end=" +
                    today.toISOString();
            }

            const [res, err] = await get(getUrl);

            if (err) {
                alert("Ada yang salah");
                console.log(err);
                return;
            }

            setIsLoading(false);

            const daftarLabel = res.data.rincian.map((item) => {
                formatTanggal(item);
            });
            const daftarOmzet = res.data.rincian.map(
                (item) => item.total_harga,
            );
        }),
    );

    return (
        <main class="p-4 relative">
            <div class="max-w-4xl mx-auto flex flex-col h-full">
                <h2 class="my-4 mb-8 font-bold text-2xl">Dashboard</h2>
                <Show when={!isLoading()} fallback={<Loading />}>
                    <div class="flex *:flex-1 join">
                        <For each={Object.entries(ALL_RENTANG)}>
                            {(item, index) => (
                                <button
                                    class={`btn join-item btn-primary ${rentang() == item[1] ? "" : "btn-outline"}`}
                                    onClick={() => {
                                        setRentang(item[1]);
                                    }}
                                >
                                    {item[0]}
                                </button>
                            )}
                        </For>
                        <canvas ref={chartRef} />
                    </div>
                </Show>
            </div>
        </main>
    );
}
