import LoadingBG from "../assets/svg/LoadingBG.jsx";
import LoadingFG from "../assets/svg/LoadingFG.jsx";

export default function Loading(props) {
    return (
        <div class={`relative ${props.class}`}>
            <LoadingBG class="absolute top-0 animate-spin" />
            <LoadingFG class="absolute top-0" />
        </div>
    );
}
