import { A } from "@solidjs/router";

export default function NotFound() {
    return (
        <main class="flex flex-col gap-4 justify-center items-center">
            <h2 class="text-xl italic text-black/80">
                Halaman tidak ditemukan.
            </h2>
            <A class="btn btn-ghost font-medium " href="/dashboard">
                Kembali ke dashboard
            </A>
        </main>
    );
}
