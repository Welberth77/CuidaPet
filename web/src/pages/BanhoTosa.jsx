import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { listarPets } from "../services/pets.js";
import { listarBanhoTosa, criarBanhoTosa, removerBanhoTosa } from "../services/banhoTosa.js";
import { SERVICOS_BANHO } from "../data/opcoesPet.js";
import { ListaRegistros, Campo, cls, hoje, formatar } from "./MedicamentosVacinas.jsx";
import EmptyArt from "../components/art/EmptyArt.jsx";

const inicial = { petId: "", servico: "", data: "", proxima: "", observacoes: "" };

export default function BanhoTosa() {
  const { usuario } = useAuth();
  const [pets, setPets] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    const [p, r] = await Promise.all([listarPets(usuario.uid), listarBanhoTosa(usuario.uid)]);
    setPets(p);
    setRegistros(r);
    setCarregando(false);
  }
  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [usuario]);

  function set(c, v) { setForm((f) => ({ ...f, [c]: v })); }

  function validar() {
    const e = {};
    if (!form.petId) e.petId = true;
    if (!form.servico) e.servico = true;
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
      await criarBanhoTosa(usuario.uid, { ...form, petNome: pet?.nome || "" });
      setForm(inicial);
      carregar();
    } finally {
      setEnviando(false);
    }
  }

  async function handleRemover(id) {
    if (!confirm("Remover este registro?")) return;
    await removerBanhoTosa(id);
    carregar();
  }

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-marca-900">Banho e Tosa</h1>

      {!carregando && pets.length === 0 ? (
        <div className="cartao flex flex-col items-center text-center">
          <EmptyArt className="w-56" />
          <p className="mt-2 font-medium text-marca-900">Cadastre um pet primeiro</p>
          <p className="mt-1 text-sm text-slate-500">Você precisa ter ao menos um pet para registrar banho e tosa.</p>
          <Link to="/pets/novo" className="btn-primario mt-5">Cadastrar pet</Link>
        </div>
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

            <Campo rotulo="Serviço" erro={erros.servico}>
              <select className={cls(erros.servico)} value={form.servico} onChange={(e) => set("servico", e.target.value)}>
                <option value="">Selecione</option>
                {SERVICOS_BANHO.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Campo>

            <Campo rotulo="Data" erro={erros.data}>
              <input type="date" max={hoje()} className={cls(erros.data)} value={form.data} onChange={(e) => set("data", e.target.value)} />
            </Campo>

            <Campo rotulo="Próximo (opcional)">
              <input type="date" className="campo" value={form.proxima} onChange={(e) => set("proxima", e.target.value)} />
            </Campo>

            <Campo rotulo="Observações (opcional)">
              <textarea rows="2" className="campo" value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} placeholder="Ex.: usar shampoo hipoalergênico" />
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
              { titulo: "Serviço", render: (r) => <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">{r.servico}</span> },
              { titulo: "Pet", render: (r) => r.petNome },
              { titulo: "Data", render: (r) => formatar(r.data) },
              { titulo: "Próximo", render: (r) => r.proxima ? formatar(r.proxima) : "-" },
              { titulo: "Obs.", render: (r) => r.observacoes || "-" },
            ]}
            vazio="Nenhum banho ou tosa registrado ainda."
          />
        </div>
      )}
    </Layout>
  );
}
