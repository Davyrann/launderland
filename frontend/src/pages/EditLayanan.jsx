import { useLocation, useNavigate } from "@solidjs/router";
import { put } from "../utils/api.js";

import LayananForm from "../components/LayananForm.jsx";
import { createSignal, onMount } from "solid-js";

export default function EditLayanan() {
    const navigate = useNavigate();
    const location = useLocation();

    async function handleForm(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        const [res, err] = await put("layanan/" + location.state.id, formData);
        if (err) {
            alert(err);
            return;
        }

        navigate("/layanan");
    }

    return (
        <main class="h-full flex flex-col justify-center items-center">
            <div>
                <LayananForm handler={handleForm} data={location.state} />
            </div>
        </main>
    );
}
