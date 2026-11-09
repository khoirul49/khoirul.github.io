import React from "react";
import ReactDOM from "react-dom/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import App from "./App";
import "./index.css";

// Ikon FontAwesome memakai CSS-nya sendiri (diimpor di atas), jadi nonaktifkan injeksi otomatis.
config.autoAddCss = false;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
