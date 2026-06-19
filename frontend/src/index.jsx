/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { Router, Route } from "@solidjs/router";
import Index from "./pages/Index";
import Laporan from "./pages/Laporan";

const root = document.getElementById("root");

render(
    () => (
        <Router>
            <Route path="/" component={Index} />
            <Route path="/keuangan" component={Laporan} />
        </Router>
    ),
    root,
);
