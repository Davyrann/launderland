import LoadingBG from "../assets/svg/LoadingBG.jsx";
import LoadingFG from "../assets/svg/LoadingFG.jsx";

export default function Loading(props) {
    return (
        <div class="bg-black/20 absolute left-0 top-0 w-full h-full flex justify-center items-center">
            <div class={`relative size-40 md:size-60`}>
                <LoadingBG class="absolute top-0 animate-spin" />
                <LoadingFG class="absolute top-0" />
            </div>
        </div>
    );
}
