import { A, useLocation } from "@solidjs/router";
import ChevronLeft from "../assets/svg/ChevronLeft";
import { onMount } from "solid-js";

import { formatRupiah } from "../utils/formatter";

export default function DetailPesanan() {
    const location = useLocation();
    console.log(location.state);

    return (
        <main class="p-4 flex justify-center items-center">
            <div class="max-w-lg w-full">
                <A href="/dashboard" class="btn btn-ghost mb-2">
                    <ChevronLeft class="size-6" />
                    Kembali
                </A>
                <div class="card bg-white shadow-md border border-black/20">
                    <div class="card-body pt-4">
                        <h2 class="card-title md:text-2xl font-bold justify-center ">
                            {location.state.no_resi}
                        </h2>
                        <div class="grid grid-cols-2 md:text-lg">
                            <strong>Nama Pelanggan</strong>
                            <span>: {location.state.nama_pelanggan}</span>
                            <strong>Total Harga</strong>
                            <span>
                                : {formatRupiah(location.state.total_harga)}
                            </span>
                            <strong>Berat</strong>
                            <span>: {location.state.berat} kg</span>
                            <strong>Status Proses</strong>
                            <span>: {location.state.status_proses}</span>
                            <strong>Status Pembayaran</strong>
                            <span>: {location.state.status_pembayaran}</span>
                            <strong>Layanan</strong>
                            <span>: {location.state.nama_layanan}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
