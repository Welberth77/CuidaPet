import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { useConfirm } from "../components/ui/Confirm.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import { ListaRegistros, Campo, cls, SemPets } from "./MedicamentosVacinas.jsx";
import { listarPets } from "../services/pets.js";
import { listarDespesas, criarDespesa, atualizarDespesa, removerDespesa } from "../services/despesas.js";
import { CATEGORIAS_DESPESA } from "../data/opcoesPet.js";
import { hoje, formatar, moeda, DATA_MINIMA } from "../utils/datas.js";

const inicial = { petId: "", categoria: "", descricao: "", valor: "", data: "" };

export default function Despesas() {
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
      const [p, r] = await Promise.all([listarPets(usuario.uid), listarDespesas()]);
      setPets(p);
      setRegistros(r);
    } catch {
      toast.erro("Não foi possível carregar as despesas.");
    } finally {
      setCarregando(false);
    }
  }
  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [usuario]);

  function set(c, v) { setForm((f) => ({ ...f, [c]: v })); }

  function editar(r) {
    setForm({ petId: r.petId || "", categoria: r.categoria || "", descricao: r.descricao || "", valor: r.valor ?? "", data: r.data || "" });
    setEditandoId(r.id);
    setErros({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function cancelar() { setForm(inicial); setEditandoId(null); setErros({}); }

  function validar() {
    const e = {};
    if (!form.petId) e.petId = true;
    if (!form.categoria) e.categoria = true;
    const v = parseFloat(form.valor);
    if (!form.valor || isNaN(v) || v <= 0 || v > 1000000) e.valor = true;
    if (!form.data) e.data = true;
    else if (form.data < DATA_MINIMA || form.data > hoje()) e.data = true;
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      const pet = pets.find((p) => p.id === form.petId);
      const dados = { ...form, petNome: pet?.nome || "" };
      if (editandoId) { await atualizarDespesa(editandoId, dados); toast.sucesso("Despesa atualizada!"); }
      else { await criarDespesa(usuario.uid, dados); toast.sucesso("Despesa registrada!"); }
      cancelar();
      carregar();
    } catch {
      toast.erro("Não foi possível salvar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleRemover(id) {
    const ok = await confirmar({ titulo: "Remover despesa?", mensagem: "Esta ação não pode ser desfeita.", confirmarTexto: "Remover" });
    if (!ok) return;
    try {
      await removerDespesa(id);
      if (editandoId === id) cancelar();
      toast.sucesso("Despesa removida.");
      carregar();
    } catch {
      toast.erro("Não foi possível remover.");
    }
  }

  // Resumo do mes atual
  const resumo = useMemo(() => {
    const agora = new Date();
    const mes = agora.getMonth(), ano = agora.getFullYear();
    const doMes = registros.filter((r) => {
      if (!r.data) return false;
      const d = new Date(r.data + "T00:00:00");
      return d.getMonth() === mes && d.getFullYear() === ano;
    });
    const total = doMes.reduce((s, r) => s + (Number(r.valor) || 0), 0);
    const porCat = {};
    for (const r of doMes) porCat[r.categoria || "Outros"] = (porCat[r.categoria || "Outros"] || 0) + (Number(r.valor) || 0);
    const totalGeral = registros.reduce((s, r) => s + (Number(r.valor) || 0), 0);
    const cats = Object.entries(porCat).sort((a, b) => b[1] - a[1]);
    return { total, totalGeral, cats, max: cats[0]?.[1] || 1 };
  }, [registros]);

  const nomeMes = new Date().toLocaleDateString("pt-BR", { month: "long" });

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold text-marca-900 dark:text-slate-100">Despesas</h1>

      {carregando ? (
        <TelaCarregando />
      ) : pets.length === 0 ? (
        <SemPets texto="Você precisa ter ao menos um pet para registrar despesas." />
      ) : (
        <>
          {/* Resumo */}
          <div className="mb-6 grid gap-4 sm:grid-cols-[260px_1fr]">
            <div className="cartao">
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Gasto em {nomeMes}</p>
              <p className="mt-1 text-3xl font-black text-marca-500 dark:text-marca-300">{moeda(resumo.total)}</p>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Total acumulado: {moeda(resumo.totalGeral)}</p>
            </div>
            <div className="cartao">
              <p className="mb-2 text-sm font-semibold text-marca-900 dark:text-slate-100">Por categoria ({nomeMes})</p>
              {resumo.cats.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">Nenhuma despesa neste mês ainda.</p>
              ) : (
                <div className="space-y-2">
                  {resumo.cats.map(([cat, val]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">{cat}</span>
                        <span className="font-medium text-marca-900 dark:text-slate-100">{moeda(val)}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                        <div className="h-2 rounded-full bg-marca-500" style={{ width: (val / resumo.max * 100) + "%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <form onSubmit={handleSubmit} className={"cartao h-fit space-y-4 " + (editandoId ? "ring-2 ring-marca-500/40" : "")} noValidate>
              <h2 className="font-semibold text-marca-900 dark:text-slate-100">{editandoId ? "Editar despesa" : "Nova despesa"}</h2>

              <Campo rotulo="Pet" erro={erros.petId}>
                <select className={cls(erros.petId)} value={form.petId} onChange={(e) => set("petId", e.target.value)}>
                  <option value="">Selecione o pet</option>
                  {pets.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </Campo>

              <Campo rotulo="Categoria" erro={erros.categoria}>
                <select className={cls(erros.categoria)} value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
                  <option value="">Selecione</option>
                  {CATEGORIAS_DESPESA.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Campo>

              <Campo rotulo="Descrição (opcional)">
                <input maxLength={80} className="campo" value={form.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Ex.: Ração premium 10kg" />
              </Campo>

              <Campo rotulo="Valor (R$)" erro={erros.valor}>
                <input type="number" step="0.01" min="0" max="1000000" className={cls(erros.valor)} value={form.valor} onChange={(e) => set("valor", e.target.value)} placeholder="0,00" />
              </Campo>

              <Campo rotulo="Data" erro={erros.data}>
                <input type="date" min={DATA_MINIMA} max={hoje()} className={cls(erros.data)} value={form.data} onChange={(e) => set("data", e.target.value)} />
              </Campo>

              <div className="flex gap-2">
                <button type="submit" className="btn-primario flex-1" disabled={enviando}>
                  {enviando ? "Salvando..." : editandoId ? "Salvar alterações" : "Registrar despesa"}
                </button>
                {editandoId && <button type="button" className="btn-secundario" onClick={cancelar}>Cancelar</button>}
              </div>
            </form>

            <ListaRegistros
              registros={registros}
              onEditar={editar}
              onRemover={handleRemover}
              selecionadoId={editandoId}
              buscarEm={(r) => `${r.categoria || ""} ${r.descricao || ""} ${r.petNome || ""}`}
              colunas={[
                { titulo: "Categoria", sort: { tipo: "texto", valor: (r) => r.categoria }, render: (r) => <span className="rounded-full bg-marca-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-marca-700 dark:text-marca-200">{r.categoria}</span> },
                { titulo: "Descrição", sort: { tipo: "texto", valor: (r) => r.descricao }, render: (r) => r.descricao || "-" },
                { titulo: "Pet", sort: { tipo: "texto", valor: (r) => r.petNome }, render: (r) => r.petNome },
                { titulo: "Valor", sort: { tipo: "num", valor: (r) => r.valor }, render: (r) => <span className="font-medium text-marca-900 dark:text-slate-100">{moeda(r.valor)}</span> },
                { titulo: "Data", sort: { tipo: "data", valor: (r) => r.data }, render: (r) => formatar(r.data) },
              ]}
              vazio="Nenhuma despesa registrada ainda."
            />
          </div>
        </>
      )}
    </Layout>
  );
}
