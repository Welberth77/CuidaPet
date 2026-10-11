import { createContext, useContext, useCallback, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remover = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const mostrar = useCallback((tipo, texto) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tipo, texto }]);
    setTimeout(() => remover(id), 4000);
  }, [remover]);

  const toast = {
    sucesso: (t) => mostrar("sucesso", t),
    erro: (t) => mostrar("erro", t),
    info: (t) => mostrar("info", t),
  };

  const estilos = {
    sucesso: "bg-emerald-600",
    erro: "bg-red-600",
    info: "bg-marca-700",
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => remover(t.id)}
            className={"pointer-events-auto w-full max-w-sm cursor-pointer rounded-lg px-4 py-3 text-sm font-medium text-white shadow-suave " + estilos[t.tipo]}
            role="status"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
