import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
import { listarNotificacoes } from "../services/shares.js";
import { supabase } from "../supabaseClient";

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

  // Atualiza o contador em tempo real quando chega/ muda um convite
  useEffect(() => {
    if (!usuario) return;
    const canal = supabase
      .channel("notif-" + usuario.uid)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pet_shares", filter: `shared_with=eq.${usuario.uid}` },
        () => atualizar()
      )
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, [usuario, atualizar]);

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
