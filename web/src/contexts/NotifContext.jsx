import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
import { listarNotificacoes } from "../services/shares.js";

const NotifContext = createContext(null);

export function NotifProvider({ children }) {
  const { usuario } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);

  const atualizar = useCallback(async () => {
    if (!usuario) { setNotificacoes([]); return; }
    try {
      setNotificacoes(await listarNotificacoes(usuario.uid));
    } catch {
      setNotificacoes([]); // tabela ainda nao existe (migracao nao rodada) ou offline
    }
  }, [usuario]);

  useEffect(() => { atualizar(); }, [atualizar]);

  return (
    <NotifContext.Provider value={{ notificacoes, count: notificacoes.length, atualizar }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotif() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error("useNotif deve ser usado dentro de NotifProvider");
  return ctx;
}
