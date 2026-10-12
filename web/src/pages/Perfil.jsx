import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import ExcluirContaModal from "../components/ExcluirContaModal.jsx";
import FotoEditor from "../components/ui/FotoEditor.jsx";
import { uploadFotoPet } from "../services/storage.js";

export default function Perfil() {
  const { usuario, perfil, atualizarPerfil, excluirConta } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const inputFoto = useRef(null);
  const [nome, setNome] = useState("");
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mostrarExcluir, setMostrarExcluir] = useState(false);
  const [arquivoOriginal, setArquivoOriginal] = useState(null);
  const [editorAberto, setEditorAberto] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

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

  function escolherFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.erro("Selecione um arquivo de imagem."); return; }
    if (file.size > 3 * 1024 * 1024) { toast.erro("A imagem deve ter no máximo 3 MB."); return; }
    setArquivoOriginal(file);
    setEditorAberto(true);
  }

  async function aoConcluirEdicao(fileRecortado) {
    setEditorAberto(false);
    setEnviandoFoto(true);
    try {
      const url = await uploadFotoPet(usuario.uid, fileRecortado);
      await atualizarPerfil({ avatar_url: url });
      toast.sucesso("Foto de perfil atualizada!");
    } catch {
      toast.erro("Não foi possível enviar a foto.");
    } finally {
      setEnviandoFoto(false);
      if (inputFoto.current) inputFoto.current.value = "";
    }
  }

  async function removerFoto() {
    try {
      await atualizarPerfil({ avatar_url: null });
      toast.sucesso("Foto removida.");
    } catch {
      toast.erro("Não foi possível remover a foto.");
    }
  }

  async function handleExcluir() {
    try {
      await excluirConta();
      navigate("/");
    } catch {
      toast.erro("Não foi possível excluir a conta. Tente novamente.");
      setMostrarExcluir(false);
    }
  }

  const avatar = perfil?.avatar_url;

  return (
    <Layout>
      {mostrarExcluir && (
        <ExcluirContaModal onCancelar={() => setMostrarExcluir(false)} onConfirmar={handleExcluir} />
      )}
      {editorAberto && arquivoOriginal && (
        <FotoEditor file={arquivoOriginal} onConcluir={aoConcluirEdicao} onCancelar={() => setEditorAberto(false)} />
      )}

      <h1 className="mb-6 text-2xl font-bold text-marca-900">Meu Perfil</h1>

      <div className="cartao max-w-xl">
        <div className="mb-6 flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt="" className="h-16 w-16 rounded-full object-cover ring-1 ring-black/5" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-marca-500 text-2xl font-bold uppercase text-white">
              {(nome || "?").charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-marca-900">{nome || "Sem nome"}</p>
            <p className="truncate text-sm text-slate-500">{usuario?.email}</p>
            <div className="mt-1 flex gap-3 text-sm">
              <input ref={inputFoto} type="file" accept="image/*" className="hidden" onChange={escolherFoto} />
              <button onClick={() => inputFoto.current?.click()} disabled={enviandoFoto}
                className="font-medium text-marca-500 hover:underline disabled:opacity-60">
                {enviandoFoto ? "Enviando..." : avatar ? "Trocar foto" : "Adicionar foto"}
              </button>
              {avatar && !enviandoFoto && (
                <button onClick={removerFoto} className="font-medium text-red-500 hover:underline">Remover</button>
              )}
            </div>
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
          <button className="btn-primario" onClick={() => setEditando(true)}>Editar perfil</button>
        )}
      </div>

      <div className="mt-8 max-w-xl rounded-xl border border-red-200 bg-red-50/40 p-5">
        <h2 className="font-semibold text-red-700">Zona de perigo</h2>
        <p className="mt-1 text-sm text-slate-600">
          Excluir sua conta remove permanentemente todos os seus pets, fotos, histórico de saúde,
          banhos, lembretes e compartilhamentos. Esta ação não pode ser desfeita.
        </p>
        <button onClick={() => setMostrarExcluir(true)}
          className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
          Excluir minha conta
        </button>
      </div>
    </Layout>
  );
}
