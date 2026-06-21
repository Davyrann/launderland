import { createSignal, onMount, onCleanup, Show } from "solid-js";
import { get } from "../utils/api";
import Loading from "../components/Loading.jsx";

export default function KoneksiWhatsapp() {
    const [status, setStatus] = createSignal("disconnected");
    const [qrCode, setQrCode] = createSignal(null);
    const [isLoading, setIsLoading] = createSignal(true);
    const [errorMsg, setErrorMsg] = createSignal(null);

    const fetchStatus = async () => {
        const [res, err] = await get("whatsapp/status");
        if (err) {
            setErrorMsg("Gagal mengambil status WhatsApp: " + err.message);
            setIsLoading(false);
            return;
        }
        setErrorMsg(null);
        if (res && res.data) {
            setStatus(res.data.status);
            setQrCode(res.data.qr);
        }
        setIsLoading(false);
    };

    onMount(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        onCleanup(() => clearInterval(interval));
    });

    return (
        <main class="relative bg-pink-50 min-h-screen h-dvh">
            <div class="max-w-md mx-auto flex flex-col h-full py-8">

                <Show
                    when={!isLoading()}
                    fallback={
                        <div class="flex justify-center my-12">
                            <Loading />
                        </div>
                    }
                >
                    <Show when={errorMsg()}>
                        <div class="alert alert-error shadow-lg mb-6 rounded-xl border border-red-200">
                            <div>
                                <span class="font-medium text-sm">
                                    {errorMsg()}
                                </span>
                            </div>
                        </div>
                    </Show>

                    <div class="card bg-white border border-black/10 shadow-xl rounded-2xl p-6 flex flex-col items-center gap-6">
                        <div class="flex flex-col items-center gap-2 w-full">
                            <span class="text-xs uppercase tracking-wider font-semibold text-gray-600">
                                Status Koneksi
                            </span>
                            <Show when={status() === "connected"}>
                                <div class="badge badge-success text-white px-4 py-3 font-semibold rounded-full animate-pulse inline-flex items-center">
                                   Terhubung
                                </div>
                            </Show>
                            <Show when={status() === "qr_ready"}>
                                <div class="badge badge-warning text-white px-4 py-3 font-semibold rounded-full  inline-flex items-center">
                                   Siap Scan QR
                                </div>
                            </Show>
                            <Show when={status() === "disconnected"}>
                                <div class="badge badge-error text-white px-4 py-3 font-semibold rounded-full inline-flex items-center">
                                   Terputus
                                </div>
                            </Show>
                        </div>

                        {/* Interactive UI based on status */}
                        <div class="w-full border-t border-gray-100 pt-6 flex flex-col items-center">
                            <Show when={status() === "connected"}>
                                <div class="text-center py-6">
                                    <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-10 w-10 text-success"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2.5"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-800">
                                        Pesan Otomatis WhatsApp Aktif!
                                    </h3>
                                    <p class="text-sm text-gray-500 mt-2 px-4">
                                        Sistem siap mengirimkan notifikasi dan
                                        e-nota otomatis ke pelanggan melalui
                                        WhatsApp.
                                    </p>
                                </div>
                            </Show>

                            <Show when={status() === "qr_ready"}>
                                <div class="text-center w-full flex flex-col items-center">
                                    <p class="text-sm text-gray-600 mb-4 font-medium">
                                        Buka WhatsApp di ponsel Anda, pilih
                                        Perangkat Tertaut, lalu scan kode QR di
                                        bawah ini:
                                    </p>
                                    <div class="p-4 bg-white border border-gray-200 rounded-2xl shadow-inner inline-block transition-transform duration-300 hover:scale-105">
                                        <Show
                                            when={qrCode()}
                                            fallback={
                                                <div class="w-48 h-48 flex items-center justify-center bg-gray-50 text-xs text-gray-400">
                                                    Membuat QR...
                                                </div>
                                            }
                                        >
                                            <img
                                                src={qrCode()}
                                                alt="WhatsApp QR Code"
                                                class="w-64 h-64 mx-auto"
                                            />
                                        </Show>
                                    </div>
                                    <p class="text-xs text-gray-400 mt-4 animate-pulse">
                                        Halaman ini akan otomatis diperbarui
                                        setelah Anda berhasil melakukan scan.
                                    </p>
                                </div>
                            </Show>

                            <Show when={status() === "disconnected"}>
                                <div class="text-center py-6">
                                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin [animation-duration:3s]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-10 w-10 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"
                                            />
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-700">
                                        Menghubungkan Mesin WhatsApp...
                                    </h3>
                                    <p class="text-sm text-gray-500 mt-2 px-4">
                                        Harap tunggu sebentar, server sedang
                                        menginisialisasi client WhatsApp. QR
                                        Code akan muncul sesaat lagi jika belum
                                        tertaut.
                                    </p>
                                </div>
                            </Show>
                        </div>
                    </div>
                </Show>
            </div>
        </main>
    );
}
