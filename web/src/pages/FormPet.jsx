import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import PetAvatar from "../components/art/PetAvatar.jsx";
import FotoEditor from "../components/ui/FotoEditor.jsx";
import { criarPet, obterPet, atualizarPet } from "../services/pets.js";
import { uploadFotoPet } from "../services/storage.js";
import { ESPECIES, RACAS, CORES, PELAGENS, SEXOS } from "../data/opcoesPet.js";
import { ehAniversarioHoje, anosFazendo, DATA_MINIMA, hoje } from "../utils/datas.js";
import Aniversario from "../components/Aniversario.jsx";

const inicial = {
  nome: "", especie: "", raca: "", sexo: "", peso: "",
  nascimento: "", cor: "", pelagem: "", sobre: "", foto_url: "",
};

const MAX_MB = 3;

export default function FormPet() {
  const { usuario } = useAuth();
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const inputFoto = useRef(null);

  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(editando);
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [arquivoOriginal, setArquivoOriginal] = useState(null);
  const [editorAberto, setEditorAberto] = useState(false);
  const [festaPet, setFestaPet] = useState(null);

  useEffect(() => {
    if (!editando) return;
    (async () => {
      const pet = await obterPet(id);
      if (pet) setForm({ ...inicial, ...pet });
      setCarregando(false);
    })();
  }, [id, editando]);

  function set(campo, valor) {
    setForm((f) => {
      const novo = { ...f, [campo]: valor };
      if (campo === "especie") { novo.raca = ""; novo.cor = ""; }
      return novo;
    });
  }

  function escolherFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.erro("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.erro(`A imagem deve ter no máximo ${MAX_MB} MB.`);
      return;
    }
    setArquivoOriginal(file);
    setEditorAberto(true);
  }

  function aoConcluirEdicao(fileRecortado, previewUrl) {
    setArquivoFoto(fileRecortado);
    setPreviewFoto(previewUrl);
    setEditorAberto(false);
  }

  function removerFoto() {
    setArquivoFoto(null);
    setPreviewFoto("");
    setArquivoOriginal(null);
    setForm((f) => ({ ...f, foto_url: "" }));
    if (inputFoto.current) inputFoto.current.value = "";
  }

  function validar() {
    const e = {};
    // Obrigatorios: apenas nome e especie
    if (!form.nome.trim()) e.nome = true;
    if (!form.especie) e.especie = true;
    // Opcionais, mas validados quando preenchidos
    if (form.peso) {
      const peso = parseFloat(form.peso);
      if (isNaN(peso) || peso < 0.1 || peso > 99) e.peso = true;
    }
    if (form.nascimento && (form.nascimento < DATA_MINIMA || form.nascimento > hoje())) e.nascimento = true;
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      let fotoUrl = form.foto_url || "";
      if (arquivoFoto) {
        try {
          fotoUrl = await uploadFotoPet(usuario.uid, arquivoFoto);
        } catch {
          toast.erro("Não foi possível enviar a foto; o pet será salvo sem a nova foto.");
        }
      }
      const dados = { ...form, foto_url: fotoUrl };
      let petId = id;
      if (editando) {
        await atualizarPet(id, dados);
        toast.sucesso("Pet atualizado!");
      } else {
        petId = await criarPet(usuario.uid, dados);
        toast.sucesso("Pet cadastrado!");
      }

      // Se o aniversario for hoje, comemora na hora (uma vez por ano)
      const ano = new Date().getFullYear();
      const chave = `cuidapet:bday:${petId}:${ano}`;
      let jaViu = false;
      try { jaViu = !!localStorage.getItem(chave); } catch { /* ignore */ }
      if (ehAniversarioHoje(dados.nascimento) && !jaViu) {
        try { localStorage.setItem(chave, "1"); } catch { /* ignore */ }
        setFestaPet({ nome: dados.nome, especie: dados.especie, foto_url: dados.foto_url, nascimento: dados.nascimento });
      } else {
        navigate("/meus-pets");
      }
    } catch (err) {
      toast.erro("Não foi possível salvar: " + (err?.message || "tente novamente"));
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <Layout><TelaCarregando /></Layout>;

  const racas = RACAS[form.especie] || [];
  const cores = CORES[form.especie] || [];
  const fotoAtual = previewFoto || form.foto_url;

  return (
    <Layout>
      {festaPet && (
        <Aniversario pet={festaPet} anos={anosFazendo(festaPet.nascimento)} onFechar={() => navigate("/meus-pets")} />
      )}
      {editorAberto && arquivoOriginal && (
        <FotoEditor
          file={arquivoOriginal}
          onConcluir={aoConcluirEdicao}
          onCancelar={() => setEditorAberto(false)}
        />
      )}
      <h1 className="mb-6 text-2xl font-bold text-marca-900">
        {editando ? "Editar pet" : "Cadastrar novo pet"}
      </h1>

      <form onSubmit={handleSubmit} className="cartao max-w-2xl space-y-5" noValidate>
        {/* Foto de perfil */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <PetAvatar especie={form.especie || "cachorro"} size={88} fotoUrl={fotoAtual} className="border border-slate-200" />
          </div>
          <div>
            <input ref={inputFoto} type="file" accept="image/*" className="hidden" onChange={escolherFoto} />
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-secundario px-4 py-2 text-sm" onClick={() => inputFoto.current?.click()}>
                {fotoAtual ? "Trocar foto" : "Adicionar foto"}
              </button>
              {arquivoOriginal && (
                <button type="button" className="btn-secundario px-4 py-2 text-sm" onClick={() => setEditorAberto(true)}>
                  Ajustar
                </button>
              )}
              {fotoAtual && (
                <button type="button" className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50" onClick={removerFoto}>
                  Remover
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">JPG ou PNG, até {MAX_MB} MB. Opcional.</p>
          </div>
        </div>

        <Campo rotulo="Nome do pet" erro={erros.nome}>
          <input className={cls(erros.nome)} value={form.nome}
            onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: Bob" />
        </Campo>

        <div className="grid gap-5 sm:grid-cols-2">
          <Campo rotulo="Espécie" erro={erros.especie}>
            <select className={cls(erros.especie)} value={form.especie} onChange={(e) => set("especie", e.target.value)}>
              <option value="">Selecione</option>
              {ESPECIES.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </Campo>

          <Campo rotulo="Raça (opcional)" erro={erros.raca}>
            <select className={cls(erros.raca)} value={form.raca} disabled={!form.especie} onChange={(e) => set("raca", e.target.value)}>
              <option value="">{form.especie ? "Selecione" : "Escolha a espécie antes"}</option>
              {racas.map((r) => <option key={r} value={r.toLowerCase()}>{r}</option>)}
            </select>
          </Campo>

          <Campo rotulo="Sexo (opcional)" erro={erros.sexo}>
            <select className={cls(erros.sexo)} value={form.sexo} onChange={(e) => set("sexo", e.target.value)}>
              <option value="">Selecione</option>
              {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Campo>

          <Campo rotulo="Peso em kg (opcional)" erro={erros.peso}>
            <input type="number" step="0.1" min="0" className={cls(erros.peso)} value={form.peso}
              onChange={(e) => set("peso", e.target.value)} placeholder="Ex.: 12.5" />
          </Campo>

          <Campo rotulo="Data de nascimento (opcional)" erro={erros.nascimento}>
            <div className="flex gap-2">
              <input type="date" min={DATA_MINIMA} max={hoje()}
                className={cls(erros.nascimento) + " flex-1"} value={form.nascimento}
                onChange={(e) => set("nascimento", e.target.value)} />
              {form.nascimento && (
                <button type="button" onClick={() => set("nascimento", "")}
                  className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Limpar
                </button>
              )}
            </div>
            {!form.nascimento && (
              <p className="mt-1 text-xs text-slate-400">
                Se você não souber a data exata, pode colocar uma data próxima — este campo é opcional.
              </p>
            )}
          </Campo>

          <Campo rotulo="Cor da pelagem (opcional)" erro={erros.cor}>
            <select className={cls(erros.cor)} value={form.cor} disabled={!form.especie} onChange={(e) => set("cor", e.target.value)}>
              <option value="">{form.especie ? "Selecione" : "Escolha a espécie antes"}</option>
              {cores.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </Campo>

          <Campo rotulo="Tipo de pelagem (opcional)" erro={erros.pelagem}>
            <select className={cls(erros.pelagem)} value={form.pelagem} onChange={(e) => set("pelagem", e.target.value)}>
              <option value="">Selecione</option>
              {PELAGENS.map((p) => <option key={p} value={p.toLowerCase()}>{p}</option>)}
            </select>
          </Campo>
        </div>

        <Campo rotulo="Sobre o pet (opcional)">
          <textarea rows="3" className="campo" value={form.sobre}
            onChange={(e) => set("sobre", e.target.value)} placeholder="Personalidade, cuidados especiais..." />
        </Campo>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primario" disabled={enviando}>
            {enviando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar pet"}
          </button>
          <button type="button" onClick={() => navigate("/meus-pets")} className="btn-secundario">Cancelar</button>
        </div>
      </form>
    </Layout>
  );
}

function Campo({ rotulo, erro, children }) {
  return (
    <div>
      <label className="rotulo">{rotulo}</label>
      {children}
      {erro && <p className="mt-1 text-xs font-medium text-red-600">Verifique este campo.</p>}
    </div>
  );
}
function cls(erro) { return "campo " + (erro ? "campo-erro" : ""); }
