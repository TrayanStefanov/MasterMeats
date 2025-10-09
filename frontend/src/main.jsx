import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";
import "./index.css";
import "./i18next.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <div data-theme="mytheme">
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
