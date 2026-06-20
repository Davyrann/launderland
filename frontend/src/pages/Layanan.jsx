import { createSignal, For, onMount, Show } from "solid-js";
import { get } from "../utils/api";
import Loading from "../components/Loading.jsx";

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
    return (
        <main class="p-4">
            <div class="max-w-4xl mx-auto flex flex-col h-full">
                <Show
                    when={!isLoading()}
                    fallback={
                        <div class="flex justify-center items-center grow">
                            <Loading class="size-1/2 md:size-1/4 mx-auto" />
                        </div>
                    }
                >
                    <div class="grid grid-cols-2 gap-4">
                        <For each={layanan()}>
                            {(item, index) => (
                                <div class="border p-4 bg-white shadow-md">
                                    {item.nama_layanan}
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </main>
    );
}
