import { useState } from "react";
import Spinner from "./ui/Spinner.jsx";

export default function ExcluirContaModal({ onCancelar, onConfirmar }) {
  const [passo, setPasso] = useState(1);
  const [texto, setTexto] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  async function confirmar() {
    setExcluindo(true);
    try {
      await onConfirmar();
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4" onClick={excluindo ? undefined : onCancelar}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-suave sm:p-8" onClick={(e) => e.stopPropagation()}>
        {passo === 1 ? (
          <>
            <div className="text-center text-4xl">🥺</div>
            <h2 className="mt-3 text-center text-xl font-bold text-marca-900">Vai mesmo nos deixar?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Antes de ir, lembre-se de tudo o que o CuidaPet guarda por você:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>🐾 Todos os seus pets e suas fotos</li>
              <li>💉 A carteira de saúde (vacinas e medicamentos)</li>
              <li>🛁 O histórico de banho e tosa</li>
              <li>🔔 Os lembretes dos próximos cuidados</li>
              <li>🤝 Os pets compartilhados com você e por você</li>
            </ul>
            <div className="mt-4 rounded-lg bg-marca-50 p-3 text-sm text-marca-800">
              Se for só uma pausa, você pode apenas <strong>sair da conta</strong> e voltar quando quiser —
              seus dados ficam aqui esperando. 💙
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button onClick={onCancelar} className="btn-primario w-full">Quero ficar 🐾</button>
              <button onClick={() => setPasso(2)} className="w-full py-2 text-sm font-medium text-slate-400 hover:text-red-600">
                Continuar com a exclusão
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-red-700">Excluir conta permanentemente</h2>
            <p className="mt-2 text-sm text-slate-600">
              Esta ação é <strong>irreversível</strong>. Você vai perder <strong>todos os seus dados</strong>:
              pets, fotos, carteira de saúde, banhos, lembretes e compartilhamentos. Não há como recuperar depois.
            </p>
            <label className="mt-5 block text-sm font-medium text-slate-700">
              Para confirmar, digite <span className="font-bold">EXCLUIR</span>:
            </label>
            <input
              className="campo mt-2"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="EXCLUIR"
              autoFocus
            />
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onCancelar} className="btn-secundario" disabled={excluindo}>Cancelar</button>
              <button
                onClick={confirmar}
                disabled={texto.trim().toUpperCase() !== "EXCLUIR" || excluindo}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {excluindo ? <><Spinner size={18} className="mr-2 border-white/40 border-t-white" /> Excluindo...</> : "Excluir definitivamente"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
