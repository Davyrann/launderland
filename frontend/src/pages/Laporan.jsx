import { createSignal, onMount, Show } from "solid-js";

import { get } from "../utils/api.js";
import {
    formatRupiah,
    formatTanggal,
    hitungRevenueSampaiHariIni,
} from "../utils/formatter.js";

import Loading from "../components/Loading.jsx";
import { Chart } from "solid-charts";
import { Axis } from "solid-charts";
import { AxisLabel } from "solid-charts";
import { AxisGrid } from "solid-charts";
import { AxisLine } from "solid-charts";
import { AxisTooltip } from "solid-charts";
import { Bar } from "solid-charts";

export default function Laporan() {
    let chartRef;

    const [isLoading, setIsLoading] = createSignal(true);
    const [rentang, setRentang] = createSignal();
    const [data, setData] = createSignal();

    onMount(async () => {
        const today = new Date();
        const sebelumRentang = new Date();
        sebelumRentang.setDate(today.getDate() - 7);

        const [res, err] = await get(
            "laporan/pendapatan?start=" +
                sebelumRentang.toISOString() +
                "&end=" +
                today.toISOString(),
        );

        if (err) {
            alert("Ada yang salah");
            console.log(err);
            return;
        }

        const data = hitungRevenueSampaiHariIni(
            res.data.rincian.map((item) => ({
                price: item.total_harga,
                date: item.tanggal_masuk,
            })),
        );
        setData(data);
        setIsLoading(false);
    });

    return (
        <main class="p-4 relative">
            <div class="max-w-4xl mx-auto flex flex-col h-full">
                <h2 class="my-4 mb-8 font-bold text-2xl">Laporan</h2>
                <Show when={!isLoading()} fallback={<Loading />}>
                    <p class="italic">Revenue selama 7 hari</p>
                    {/* <Show when={data()}></Show>*/}
                </Show>
                <Show when={data()}>
                    <Chart data={data()} class="pb-10" height={600}>
                        <Axis axis="y" position="left">
                            <AxisLabel format={formatRupiah} />
                            <AxisGrid class="opacity-20" />
                        </Axis>
                        <Axis axis="x" position="bottom" dataKey="date">
                            <AxisLabel format={formatTanggal} />
                            <AxisLine />
                        </Axis>
                        <Bar
                            dataKey="totalPrice"
                            class="stroke-sc-400"
                            stroke-width={3}
                        />
                    </Chart>
                </Show>
            </div>
        </main>
    );
}
