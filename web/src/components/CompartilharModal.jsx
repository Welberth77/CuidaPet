import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "./ui/Toast.jsx";
import { useConfirm } from "./ui/Confirm.jsx";
import Spinner from "./ui/Spinner.jsx";
import {
  buscarUsuarios, enviarConvite, listarConvitesDoPet, removerConvite,
} from "../services/shares.js";

export default function CompartilharModal({ pet, onFechar }) {
  const { usuario, perfil } = useAuth();
  const toast = useToast();
  const confirmar = useConfirm();

  const [convites, setConvites] = useState([]);
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [buscou, setBuscou] = useState(false);

  async function carregar() {
    try { setConvites(await listarConvitesDoPet(pet.id)); } catch { /* ignore */ }
  }
  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [pet.id]);

  async function buscar(e) {
    e.preventDefault();
    if (termo.trim().length < 2) {
      toast.info("Digite ao menos 2 letras do nome ou e-mail.");
      return;
    }
    setBuscando(true);
    setBuscou(false);
    try {
      setResultados(await buscarUsuarios(termo.trim()));
      setBuscou(true);
    } catch (err) {
      const m = String(err?.message || "");
      if (m.includes("function") && m.includes("buscar_usuarios")) {
        toast.erro("A busca ainda não foi ativada no banco. Rode o compartilhamento.sql no Supabase.");
      } else {
        toast.erro("Erro ao buscar: " + (err?.message || "tente novamente"));
      }
    } finally {
      setBuscando(false);
    }
  }

  async function convidar(alvo) {
    if (convites.some((c) => c.shared_with === alvo.id)) {
      toast.info("Esse usuário já foi convidado.");
      return;
    }
    try {
      const dono = { uid: usuario.uid, nome: perfil?.nome || "", email: usuario.email };
      await enviarConvite({ pet, dono, alvo });
      toast.sucesso(`Convite enviado para ${alvo.nome || alvo.email}.`);
      carregar();
    } catch (err) {
      if (String(err?.message || "").includes("duplicate")) toast.info("Esse usuário já foi convidado.");
      else toast.erro("Não foi possível enviar o convite.");
    }
  }

  async function remover(c) {
    const ok = await confirmar({
      titulo: "Remover compartilhamento?",
      mensagem: `${c.shared_with_nome || c.shared_with_email} perderá o acesso a ${pet.nome}.`,
      confirmarTexto: "Remover",
    });
    if (!ok) return;
    try {
      await removerConvite(c.id);
      toast.sucesso("Compartilhamento removido.");
      carregar();
    } catch {
      toast.erro("Não foi possível remover.");
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4" onClick={onFechar}>
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-suave" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-marca-900 dark:text-slate-100">Compartilhar {pet.nome}</h2>
          <button onClick={onFechar} className="text-slate-400 dark:text-slate-500 hover:text-slate-600" aria-label="Fechar">✕</button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Busque um usuário cadastrado pelo e-mail ou nome e envie um convite. Ele decide se aceita —
          e você pode remover o acesso quando quiser.
        </p>

        <form onSubmit={buscar} className="mt-4 flex gap-2">
          <input className="campo" placeholder="E-mail ou nome do usuário"
            value={termo} onChange={(e) => setTermo(e.target.value)} />
          <button type="submit" className="btn-primario px-4" disabled={buscando}>
            {buscando ? <Spinner size={18} className="border-white/40 border-t-white" /> : "Buscar"}
          </button>
        </form>

        {buscou && (
          <div className="mt-3 space-y-2">
            {resultados.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Nenhum usuário encontrado.</p>
            ) : (
              resultados.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-marca-900 dark:text-slate-100">{u.nome || "Sem nome"}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                  </div>
                  <button className="btn-secundario px-3 py-1.5 text-sm" onClick={() => convidar(u)}>Convidar</button>
                </div>
              ))
            )}
          </div>
        )}

        {convites.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-marca-700 dark:text-marca-200">Compartilhado com</h3>
            <div className="space-y-2">
              {convites.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-marca-900 dark:text-slate-100">{c.shared_with_nome || c.shared_with_email}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{c.shared_with_email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (c.status === "aceito" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                      {c.status === "aceito" ? "Aceito" : "Pendente"}
                    </span>
                    <button onClick={() => remover(c)} className="text-xs font-medium text-red-500 hover:underline">Remover</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
