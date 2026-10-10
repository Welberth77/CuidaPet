import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ConfigNotice from "./components/ConfigNotice.jsx";
import { supabaseConfigValido } from "./supabaseClient";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {supabaseConfigValido ? (
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    ) : (
      <ConfigNotice />
    )}
  </React.StrictMode>
);
