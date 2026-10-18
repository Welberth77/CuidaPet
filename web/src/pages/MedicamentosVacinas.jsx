import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { useConfirm } from "../components/ui/Confirm.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import BadgePrazo from "../components/ui/BadgePrazo.jsx";
import EmptyArt from "../components/art/EmptyArt.jsx";
import { listarPets } from "../services/pets.js";
import { listarSaude, criarSaude, atualizarSaude, removerSaude } from "../services/saude.js";
import { CATEGORIAS_SAUDE } from "../data/opcoesPet.js";
import { hoje, formatar, DATA_MINIMA, maxFuturo } from "../utils/datas.js";

const inicial = { petId: "", categoria: "", nome: "", data: "", proxima: "" };

export default function MedicamentosVacinas() {
  const { usuario } = useAuth();
  const toast = useToast();
  const confirmar = useConfirm();
  const [pets, setPets] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  async function carregar() {
    try {
      const [p, r] = await Promise.all([listarPets(usuario.uid), listarSaude(usuario.uid)]);
      setPets(p);
      setRegistros(r);
    } catch {
      toast.erro("Não foi possível carregar os registros.");
    } finally {
      setCarregando(false);
    }
  }
  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [usuario]);

  function set(c, v) { setForm((f) => ({ ...f, [c]: v })); }

  function editar(r) {
    setForm({ petId: r.petId || "", categoria: r.categoria || "", nome: r.nome || "", data: r.data || "", proxima: r.proxima || "" });
    setEditandoId(r.id);
    setErros({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setForm(inicial);
    setEditandoId(null);
    setErros({});
  }

  function validar() {
    const e = {};
    if (!form.petId) e.petId = true;
    if (!form.categoria) e.categoria = true;
    if (!form.nome.trim()) e.nome = true;
    if (!form.data) e.data = true;
    else if (form.data < DATA_MINIMA || form.data > hoje()) e.data = true;
    if (form.proxima && (form.proxima < (form.data || hoje()) || form.proxima > maxFuturo())) e.proxima = true;
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      const pet = pets.find((p) => p.id === form.petId);
      const dados = { ...form, nome: form.nome.trim(), petNome: pet?.nome || "" };
      if (editandoId) {
        await atualizarSaude(editandoId, dados);
        toast.sucesso("Registro atualizado!");
      } else {
        await criarSaude(usuario.uid, dados);
        toast.sucesso("Registro salvo!");
      }
      cancelar();
      carregar();
    } catch {
      toast.erro("Não foi possível salvar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleRemover(id) {
    const ok = await confirmar({ titulo: "Remover registro?", mensagem: "Esta ação não pode ser desfeita.", confirmarTexto: "Remover" });
    if (!ok) return;
    try {
      await removerSaude(id);
      if (editandoId === id) cancelar();
      toast.sucesso("Registro removido.");
      carregar();
    } catch {
      toast.erro("Não foi possível remover.");
    }
  }

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-marca-900">Medicamentos e Vacinas</h1>

      {carregando ? (
        <TelaCarregando />
      ) : pets.length === 0 ? (
        <SemPets texto="Você precisa ter ao menos um pet para registrar vacinas e medicamentos." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={handleSubmit} className={"cartao h-fit space-y-4 " + (editandoId ? "ring-2 ring-marca-500/40" : "")} noValidate>
            <h2 className="font-semibold text-marca-900">{editandoId ? "Editar registro" : "Registrar novo"}</h2>

            <Campo rotulo="Pet" erro={erros.petId}>
              <select className={cls(erros.petId)} value={form.petId} onChange={(e) => set("petId", e.target.value)}>
                <option value="">Selecione o pet</option>
                {pets.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </Campo>

            <Campo rotulo="Categoria" erro={erros.categoria}>
              <select className={cls(erros.categoria)} value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
                <option value="">Selecione</option>
                {CATEGORIAS_SAUDE.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Campo>

            <Campo rotulo="Nome do medicamento / vacina" erro={erros.nome}>
              <input maxLength={60} className={cls(erros.nome)} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: V10, Vermífugo" />
            </Campo>

            <Campo rotulo="Data de aplicação" erro={erros.data}>
              <input type="date" min={DATA_MINIMA} max={hoje()} className={cls(erros.data)} value={form.data} onChange={(e) => set("data", e.target.value)} />
            </Campo>

            <Campo rotulo="Próxima dose (opcional)" erro={erros.proxima}>
              <input type="date" min={form.data || hoje()} max={maxFuturo()} className={cls(erros.proxima)} value={form.proxima} onChange={(e) => set("proxima", e.target.value)} />
            </Campo>

            <div className="flex gap-2">
              <button type="submit" className="btn-primario flex-1" disabled={enviando}>
                {enviando ? "Salvando..." : editandoId ? "Salvar alterações" : "Salvar registro"}
              </button>
              {editandoId && (
                <button type="button" className="btn-secundario" onClick={cancelar}>Cancelar</button>
              )}
            </div>
          </form>

          <ListaRegistros
            registros={registros}
            onEditar={editar}
            onRemover={handleRemover}
            selecionadoId={editandoId}
            colunas={[
              { titulo: "Categoria", render: (r) => <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (r.categoria === "Vacina" ? "bg-emerald-100 text-emerald-700" : "bg-marca-100 text-marca-700")}>{r.categoria}</span> },
              { titulo: "Nome", render: (r) => r.nome },
              { titulo: "Pet", render: (r) => r.petNome },
              { titulo: "Aplicado em", render: (r) => formatar(r.data) },
              { titulo: "Próxima", render: (r) => <BadgePrazo iso={r.proxima} /> },
            ]}
            vazio="Nenhuma vacina ou medicamento registrado ainda."
          />
        </div>
      )}
    </Layout>
  );
}

export function SemPets({ texto }) {
  return (
    <div className="cartao flex flex-col items-center text-center">
      <EmptyArt className="w-56" />
      <p className="mt-2 font-medium text-marca-900">Cadastre um pet primeiro</p>
      <p className="mt-1 text-sm text-slate-500">{texto}</p>
      <Link to="/pets/novo" className="btn-primario mt-5">Cadastrar pet</Link>
    </div>
  );
}

export function ListaRegistros({ registros, onEditar, onRemover, colunas, vazio, selecionadoId }) {
  if (registros.length === 0) return <div className="cartao text-slate-500">{vazio}</div>;
  return (
    <div className="cartao overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
            {colunas.map((c) => <th key={c.titulo} className="px-4 py-3">{c.titulo}</th>)}
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.id} className={"border-b border-slate-50 align-top last:border-0 hover:bg-slate-50/60 " + (selecionadoId === r.id ? "bg-marca-50" : "")}>
              {colunas.map((c) => <td key={c.titulo} className="px-4 py-3 text-slate-700">{c.render(r)}</td>)}
              <td className="whitespace-nowrap px-4 py-3 text-right">
                {onEditar && (
                  <button onClick={() => onEditar(r)} className="mr-3 text-xs font-medium text-marca-500 hover:underline">Editar</button>
                )}
                <button onClick={() => onRemover(r.id)} className="text-xs font-medium text-red-500 hover:underline">Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Campo({ rotulo, erro, children }) {
  return (
    <div>
      <label className="rotulo">{rotulo}</label>
      {children}
      {erro && <p className="mt-1 text-xs font-medium text-red-600">Verifique este campo.</p>}
    </div>
  );
}
export function cls(erro) { return "campo " + (erro ? "campo-erro" : ""); }
