/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { Router, Route, Navigate } from "@solidjs/router";

import Dashboard from "./pages/Dashboard";
import Laporan from "./pages/Laporan";
import Layanan from "./pages/Layanan";
import Layout from "./components/Layout";
import BuatPesanan from "./pages/BuatPesanan";

const root = document.getElementById("root");

render(
    () => (
        <Router root={Layout}>
            <Route path="/" component={() => <Navigate href="/dashboard" />} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/laporan" component={Laporan} />
            <Route path="/layanan" component={Layanan} />
            <Route path="/buat-pesanan" component={BuatPesanan} />
        </Router>
    ),
    root,
);
