import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { NotifProvider } from "./contexts/NotifContext.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { ConfirmProvider } from "./components/ui/Confirm.jsx";
import ConfigNotice from "./components/ConfigNotice.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { supabaseConfigValido } from "./supabaseClient";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
    {supabaseConfigValido ? (
      <BrowserRouter>
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>
              <NotifProvider>
                <App />
              </NotifProvider>
            </AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </BrowserRouter>
    ) : (
      <ConfigNotice />
    )}
    </ErrorBoundary>
  </React.StrictMode>
);
