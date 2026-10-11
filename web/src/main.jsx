import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { ConfirmProvider } from "./components/ui/Confirm.jsx";
import ConfigNotice from "./components/ConfigNotice.jsx";
import { supabaseConfigValido } from "./supabaseClient";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {supabaseConfigValido ? (
      <BrowserRouter>
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </BrowserRouter>
    ) : (
      <ConfigNotice />
    )}
  </React.StrictMode>
);
