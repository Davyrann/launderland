import { A } from "@solidjs/router";
import { For } from "solid-js";
import Bars3 from "../assets/svg/Bars3.jsx";
import Logo from "../assets/svg/Logo.jsx";

export default function Layout({ children }) {
    const NAV = [
        { href: "/dashboard", name: "Dashboard" },
        { href: "/layanan", name: "Layanan" },
        { href: "/laporan", name: "Laporan" },
    ];

    return (
        <>
            <header class="navbar bg-pink-600 shadow-md text-white">
                <div class="navbar-start">
                    <div class="dropdown">
                        <div
                            tabindex="0"
                            role="button"
                            class="btn btn-ghost lg:hidden px-2"
                        >
                            <Bars3 />
                        </div>
                        <ul
                            tabindex="-1"
                            class="menu dropdown-content bg-pink-600 rounded-box z-1 mt-4 w-52 p-2 font-semibold"
                        >
                            <For each={NAV}>
                                {(item, index) => (
                                    <li>
                                        <A href={item.href}>{item.name}</A>
                                    </li>
                                )}
                            </For>
                        </ul>
                    </div>
                    <A
                        href="/"
                        class="btn btn-ghost hover:bg-pink-500 hover:border-pink-500 hover:text-white text-xl font-bold px-1"
                    >
                        <Logo class="h-full p-1" />
                        LaunderLand
                    </A>
                </div>
                <div class="navbar-end hidden lg:flex">
                    <ul class="menu menu-horizontal px-1 ">
                        <For each={NAV}>
                            {(item, index) => (
                                <li>
                                    <A
                                        class="font-semibold"
                                        activeClass="bg-pink-800"
                                        href={item.href}
                                    >
                                        {item.name}
                                    </A>
                                </li>
                            )}
                        </For>
                    </ul>
                </div>
            </header>
            {children}
        </>
    );
}
