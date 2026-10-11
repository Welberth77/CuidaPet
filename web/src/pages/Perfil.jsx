import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";

export default function Perfil() {
  const { usuario, perfil, atualizarPerfil } = useAuth();
  const toast = useToast();
  const [nome, setNome] = useState("");
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNome(perfil?.nome || usuario?.displayName || "");
  }, [perfil, usuario]);

  async function handleSalvar(e) {
    e.preventDefault();
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      await atualizarPerfil({ nome: nome.trim() });
      setEditando(false);
      toast.sucesso("Dados atualizados com sucesso!");
    } catch {
      toast.erro("Não foi possível atualizar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-marca-900">Meu Perfil</h1>

      <div className="cartao max-w-xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-marca-500 text-2xl font-bold uppercase text-white">
            {(nome || "?").charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-marca-900">{nome || "Sem nome"}</p>
            <p className="text-sm text-slate-500">{usuario?.email}</p>
          </div>
        </div>

        {editando ? (
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="rotulo">Nome completo</label>
              <input className="campo" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div>
              <label className="rotulo">E-mail</label>
              <input className="campo bg-slate-100 text-slate-500" value={usuario?.email || ""} disabled />
              <p className="mt-1 text-xs text-slate-400">O e-mail não pode ser alterado.</p>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" className="btn-primario" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button type="button" className="btn-secundario" onClick={() => { setEditando(false); setNome(perfil?.nome || ""); }}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button className="btn-primario" onClick={() => setEditando(true)}>
            Editar perfil
          </button>
        )}
      </div>
    </Layout>
  );
}
