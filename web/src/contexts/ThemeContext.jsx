import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

function temaInicial() {
  try {
    const salvo = localStorage.getItem("cuidapet:tema");
    if (salvo === "escuro") return "escuro";
  } catch { /* ignore */ }
  // Padrao: modo claro (nao segue a preferencia do sistema)
  return "claro";
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    const root = document.documentElement;
    if (tema === "escuro") root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem("cuidapet:tema", tema); } catch { /* ignore */ }
    // Atualiza a cor da barra do navegador (mobile)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", tema === "escuro" ? "#0F172A" : "#0B7ABF");
  }, [tema]);

  const alternar = () => setTema((t) => (t === "escuro" ? "claro" : "escuro"));

  return (
    <ThemeContext.Provider value={{ tema, alternar, setTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTema deve ser usado dentro de ThemeProvider");
  return ctx;
}
