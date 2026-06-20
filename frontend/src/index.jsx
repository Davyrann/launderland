/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { Router, Route } from "@solidjs/router";

import Dashboard from "./pages/Dashboard";
import Laporan from "./pages/Laporan";
import Layanan from "./pages/Layanan";
import Layout from "./components/Layout";

const root = document.getElementById("root");

render(
    () => (
        <Router root={Layout}>
            <Route path="/" component={Dashboard} />
            <Route path="/laporan" component={Laporan} />
            <Route path="/layanan" component={Layanan} />
        </Router>
    ),
    root,
);
