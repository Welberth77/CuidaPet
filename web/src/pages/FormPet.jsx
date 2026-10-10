import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { criarPet, obterPet, atualizarPet } from "../services/pets.js";
import { ESPECIES, RACAS, CORES, PELAGENS, SEXOS } from "../data/opcoesPet.js";

const inicial = {
  nome: "", especie: "", raca: "", sexo: "", peso: "",
  nascimento: "", cor: "", pelagem: "", sobre: "",
};

export default function FormPet() {
  const { usuario } = useAuth();
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(editando);

  useEffect(() => {
    if (!editando) return;
    (async () => {
      const pet = await obterPet(id);
      if (pet) {
        const { id: _, ownerId, criadoEm, ...resto } = pet;
        setForm({ ...inicial, ...resto });
      }
      setCarregando(false);
    })();
  }, [id, editando]);

  function set(campo, valor) {
    setForm((f) => {
      const novo = { ...f, [campo]: valor };
      if (campo === "especie") {
        novo.raca = "";
        novo.cor = "";
      }
      return novo;
    });
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = true;
    if (!form.especie) e.especie = true;
    if (!form.raca) e.raca = true;
    if (!form.sexo) e.sexo = true;
    const peso = parseFloat(form.peso);
    if (!form.peso || isNaN(peso) || peso < 0.1 || peso > 99) e.peso = true;
    if (!form.nascimento) e.nascimento = true;
    else if (new Date(form.nascimento) > new Date()) e.nascimento = true;
    if (!form.cor) e.cor = true;
    if (!form.pelagem) e.pelagem = true;
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      if (editando) {
        await atualizarPet(id, form);
      } else {
        await criarPet(usuario.uid, form);
      }
      navigate("/meus-pets");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return <Layout><p className="text-slate-500">Carregando...</p></Layout>;
  }

  const racas = RACAS[form.especie] || [];
  const cores = CORES[form.especie] || [];

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-marca-900">
        {editando ? "Editar pet" : "Cadastrar novo pet"}
      </h1>

      <form onSubmit={handleSubmit} className="cartao max-w-2xl space-y-5" noValidate>
        <Campo rotulo="Nome do pet" erro={erros.nome}>
          <input className={cls(erros.nome)} value={form.nome}
            onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: Bob" />
        </Campo>

        <div className="grid gap-5 sm:grid-cols-2">
          <Campo rotulo="Espécie" erro={erros.especie}>
            <select className={cls(erros.especie)} value={form.especie}
              onChange={(e) => set("especie", e.target.value)}>
              <option value="">Selecione</option>
              {ESPECIES.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </Campo>

          <Campo rotulo="Raça" erro={erros.raca}>
            <select className={cls(erros.raca)} value={form.raca} disabled={!form.especie}
              onChange={(e) => set("raca", e.target.value)}>
              <option value="">{form.especie ? "Selecione" : "Escolha a espécie antes"}</option>
              {racas.map((r) => <option key={r} value={r.toLowerCase()}>{r}</option>)}
            </select>
          </Campo>

          <Campo rotulo="Sexo" erro={erros.sexo}>
            <select className={cls(erros.sexo)} value={form.sexo}
              onChange={(e) => set("sexo", e.target.value)}>
              <option value="">Selecione</option>
              {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Campo>

          <Campo rotulo="Peso (kg)" erro={erros.peso}>
            <input type="number" step="0.1" min="0" className={cls(erros.peso)} value={form.peso}
              onChange={(e) => set("peso", e.target.value)} placeholder="Ex.: 12.5" />
          </Campo>

          <Campo rotulo="Data de nascimento" erro={erros.nascimento}>
            <input type="date" max={new Date().toISOString().split("T")[0]}
              className={cls(erros.nascimento)} value={form.nascimento}
              onChange={(e) => set("nascimento", e.target.value)} />
          </Campo>

          <Campo rotulo="Cor da pelagem" erro={erros.cor}>
            <select className={cls(erros.cor)} value={form.cor} disabled={!form.especie}
              onChange={(e) => set("cor", e.target.value)}>
              <option value="">{form.especie ? "Selecione" : "Escolha a espécie antes"}</option>
              {cores.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </Campo>

          <Campo rotulo="Tipo de pelagem" erro={erros.pelagem}>
            <select className={cls(erros.pelagem)} value={form.pelagem}
              onChange={(e) => set("pelagem", e.target.value)}>
              <option value="">Selecione</option>
              {PELAGENS.map((p) => <option key={p} value={p.toLowerCase()}>{p}</option>)}
            </select>
          </Campo>
        </div>

        <Campo rotulo="Sobre o pet (opcional)">
          <textarea rows="3" className="campo" value={form.sobre}
            onChange={(e) => set("sobre", e.target.value)}
            placeholder="Personalidade, cuidados especiais..." />
        </Campo>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primario" disabled={enviando}>
            {enviando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar pet"}
          </button>
          <button type="button" onClick={() => navigate("/meus-pets")} className="btn-secundario">
            Cancelar
          </button>
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
      {erro && <p className="mt-1 text-xs font-medium text-red-600">Campo obrigatório ou inválido.</p>}
    </div>
  );
}

function cls(erro) {
  return "campo " + (erro ? "campo-erro" : "");
}
