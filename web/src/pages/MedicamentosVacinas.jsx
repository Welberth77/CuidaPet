import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { listarPets } from "../services/pets.js";
import { listarSaude, criarSaude, removerSaude } from "../services/saude.js";
import { CATEGORIAS_SAUDE } from "../data/opcoesPet.js";
import EmptyArt from "../components/art/EmptyArt.jsx";

const inicial = { petId: "", categoria: "", nome: "", data: "", proxima: "" };

export default function MedicamentosVacinas() {
  const { usuario } = useAuth();
  const [pets, setPets] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    const [p, r] = await Promise.all([listarPets(usuario.uid), listarSaude(usuario.uid)]);
    setPets(p);
    setRegistros(r);
    setCarregando(false);
  }

  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [usuario]);

  function set(c, v) { setForm((f) => ({ ...f, [c]: v })); }

  function validar() {
    const e = {};
    if (!form.petId) e.petId = true;
    if (!form.categoria) e.categoria = true;
    if (!form.nome.trim()) e.nome = true;
    if (!form.data) e.data = true;
    else if (new Date(form.data) > new Date()) e.data = true;
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      const pet = pets.find((p) => p.id === form.petId);
      await criarSaude(usuario.uid, { ...form, petNome: pet?.nome || "" });
      setForm(inicial);
      carregar();
    } finally {
      setEnviando(false);
    }
  }

  async function handleRemover(id) {
    if (!confirm("Remover este registro?")) return;
    await removerSaude(id);
    carregar();
  }

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-marca-900">Medicamentos e Vacinas</h1>

      {!carregando && pets.length === 0 ? (
        <SemPets />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={handleSubmit} className="cartao h-fit space-y-4" noValidate>
            <h2 className="font-semibold text-marca-900">Registrar novo</h2>

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
              <input className={cls(erros.nome)} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: V10, Vermífugo" />
            </Campo>

            <Campo rotulo="Data de aplicação" erro={erros.data}>
              <input type="date" max={hoje()} className={cls(erros.data)} value={form.data} onChange={(e) => set("data", e.target.value)} />
            </Campo>

            <Campo rotulo="Próxima dose (opcional)">
              <input type="date" className="campo" value={form.proxima} onChange={(e) => set("proxima", e.target.value)} />
            </Campo>

            <button type="submit" className="btn-primario w-full" disabled={enviando}>
              {enviando ? "Salvando..." : "Salvar registro"}
            </button>
          </form>

          <ListaRegistros
            carregando={carregando}
            registros={registros}
            onRemover={handleRemover}
            colunas={[
              { titulo: "Categoria", render: (r) => <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (r.categoria === "Vacina" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{r.categoria}</span> },
              { titulo: "Nome", render: (r) => r.nome },
              { titulo: "Pet", render: (r) => r.petNome },
              { titulo: "Data", render: (r) => formatar(r.data) },
              { titulo: "Próxima", render: (r) => r.proxima ? formatar(r.proxima) : "-" },
            ]}
            vazio="Nenhuma vacina ou medicamento registrado ainda."
          />
        </div>
      )}
    </Layout>
  );
}

function SemPets() {
  return (
    <div className="cartao flex flex-col items-center text-center">
      <EmptyArt className="w-56" />
      <p className="mt-2 font-medium text-marca-900">Cadastre um pet primeiro</p>
      <p className="mt-1 text-sm text-slate-500">Você precisa ter ao menos um pet para registrar vacinas e medicamentos.</p>
      <Link to="/pets/novo" className="btn-primario mt-5">Cadastrar pet</Link>
    </div>
  );
}

export function ListaRegistros({ carregando, registros, onRemover, colunas, vazio }) {
  if (carregando) return <p className="text-slate-500">Carregando...</p>;
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
            <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
              {colunas.map((c) => <td key={c.titulo} className="px-4 py-3 text-slate-700">{c.render(r)}</td>)}
              <td className="px-4 py-3 text-right">
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
      {erro && <p className="mt-1 text-xs font-medium text-red-600">Campo obrigatório ou inválido.</p>}
    </div>
  );
}
export function cls(erro) { return "campo " + (erro ? "campo-erro" : ""); }
export function hoje() { return new Date().toISOString().split("T")[0]; }
export function formatar(iso) {
  if (!iso) return "-";
  const [a, m, d] = iso.split("-");
  return d ? `${d}/${m}/${a}` : iso;
}
