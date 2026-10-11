import { createContext, useContext, useCallback, useRef, useState } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [estado, setEstado] = useState(null);
  const resolver = useRef(null);

  const confirmar = useCallback((opts) => {
    setEstado({
      titulo: opts.titulo || "Tem certeza?",
      mensagem: opts.mensagem || "",
      confirmarTexto: opts.confirmarTexto || "Confirmar",
      perigo: opts.perigo ?? true,
    });
    return new Promise((res) => {
      resolver.current = res;
    });
  }, []);

  function responder(valor) {
    setEstado(null);
    resolver.current?.(valor);
  }

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}
      {estado && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4" onClick={() => responder(false)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-suave" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-marca-900">{estado.titulo}</h3>
            {estado.mensagem && <p className="mt-2 text-sm text-slate-600">{estado.mensagem}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secundario" onClick={() => responder(false)}>Cancelar</button>
              <button
                className={estado.perigo
                  ? "inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700"
                  : "btn-primario"}
                onClick={() => responder(true)}
              >
                {estado.confirmarTexto}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm deve ser usado dentro de ConfirmProvider");
  return ctx;
}
