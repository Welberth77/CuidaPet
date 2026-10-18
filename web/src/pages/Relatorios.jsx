import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { obterRelatorio, listarUsuariosAdmin, listarPetsAdmin } from "../services/relatorios.js";
import { moeda } from "../utils/datas.js";
import { Kpi, BarrasH, ColunasMensais, Donut } from "../components/charts/Graficos.jsx";

function Card({ titulo, sub, children, className = "" }) {
  return (
    <div className={"rounded-2xl border border-slate-200 bg-white p-5 shadow-suave " + className}>
      {titulo && <h3 className="text-sm font-semibold text-marca-900">{titulo}</h3>}
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
      <div className={titulo ? "mt-4" : ""}>{children}</div>
    </div>
  );
}

const pct = (a, b) => (!b ? "0%" : Math.round((a / b) * 100) + "%");
const soData = (iso) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "—");
const dataHora = (iso) => (iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "nunca");

// --------------------------------------------------------------------------
export default function Relatorios() {
  const toast = useToast();
  const [aba, setAba] = useState("geral");

  const [dados, setDados] = useState(null);
  const [usuarios, setUsuarios] = useState(null);
  const [pets, setPets] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  async function carregarGeral() {
    setCarregando(true); setErro(false);
    try { setDados(await obterRelatorio()); }
    catch { setErro(true); toast.erro("Não foi possível carregar os relatórios."); }
    finally { setCarregando(false); }
  }
  useEffect(() => { carregarGeral(); /* eslint-disable-next-line */ }, []);

  async function abrir(novaAba) {
    setAba(novaAba);
    try {
      if (novaAba === "usuarios" && usuarios === null) setUsuarios(await listarUsuariosAdmin());
      if (novaAba === "pets" && pets === null) setPets(await listarPetsAdmin());
    } catch {
      toast.erro("Não foi possível carregar a lista.");
    }
  }

  const abas = [
    { id: "geral", label: "Visão geral" },
    { id: "usuarios", label: "Usuários" },
    { id: "pets", label: "Pets" },
  ];

  return (
    <Layout>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-marca-900">Relatórios</h1>
          <p className="text-sm text-slate-500">Visão administrativa do CuidaPet</p>
        </div>
        {aba === "geral" && <button onClick={carregarGeral} className="btn-secundario text-sm">Atualizar</button>}
      </div>

      {/* Abas */}
      <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1">
        {abas.map((a) => (
          <button key={a.id} onClick={() => abrir(a.id)}
            className={"rounded-lg px-4 py-1.5 text-sm font-medium transition-colors " +
              (aba === a.id ? "bg-marca-500 text-white" : "text-slate-600 hover:bg-slate-100")}>
            {a.label}
          </button>
        ))}
      </div>

      {aba === "geral" && <VisaoGeral dados={dados} carregando={carregando} erro={erro} recarregar={carregarGeral} />}
      {aba === "usuarios" && <TabelaUsuarios lista={usuarios} />}
      {aba === "pets" && <TabelaPets lista={pets} />}
    </Layout>
  );
}

// --------------------------------------------------------------------------
function VisaoGeral({ dados, carregando, erro, recarregar }) {
  if (carregando) return <TelaCarregando />;
  if (erro || !dados) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-suave">
        <p className="text-slate-600">Não foi possível carregar os relatórios.</p>
        <button onClick={recarregar} className="btn-primario mt-4">Tentar novamente</button>
      </div>
    );
  }
  const t = dados.totais || {};
  const geradoEm = dados.gerado_em ? new Date(dados.gerado_em).toLocaleString("pt-BR") : "";
  const mediaPets = t.usuarios ? (t.pets / t.usuarios).toFixed(1) : "0";

  return (
    <>
      {geradoEm && <p className="mb-3 text-xs text-slate-400">Atualizado em {geradoEm}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Kpi rotulo="Usuários" valor={(t.usuarios || 0).toLocaleString("pt-BR")} sub={`${t.usuarios_confirmados || 0} confirmados (${pct(t.usuarios_confirmados, t.usuarios)})`} destaque />
        <Kpi rotulo="Pets cadastrados" valor={(t.pets || 0).toLocaleString("pt-BR")} sub={`${mediaPets} por usuário`} destaque />
        <Kpi rotulo="Usuários ativos" valor={(t.usuarios_ativos || 0).toLocaleString("pt-BR")} sub={`com pet (${pct(t.usuarios_ativos, t.usuarios)})`} />
        <Kpi rotulo="Compartilhamentos" valor={(t.compartilhamentos || 0).toLocaleString("pt-BR")} sub={`${t.compartilhamentos_aceitos || 0} aceitos`} />
        <Kpi rotulo="Registros de saúde" valor={(t.saude || 0).toLocaleString("pt-BR")} sub="vacinas e medicamentos" />
        <Kpi rotulo="Banho e tosa" valor={(t.banho || 0).toLocaleString("pt-BR")} sub="registros" />
        <Kpi rotulo="Despesas" valor={moeda(t.despesas_total || 0)} sub={`${t.despesas_qtd || 0} lançamentos`} />
        <Kpi rotulo="Novos (30 dias)" valor={`+${t.novos_usuarios_30d || 0}`} sub={`usuários · +${t.novos_pets_30d || 0} pets`} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-marca-900">Crescimento</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Novos usuários por mês" sub="Últimos 12 meses"><ColunasMensais dados={dados.usuarios_por_mes} cor="#0B7ABF" /></Card>
        <Card titulo="Novos pets por mês" sub="Últimos 12 meses"><ColunasMensais dados={dados.pets_por_mes} cor="#FF7A59" /></Card>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-marca-900">Perfil dos pets</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Por espécie"><BarrasH dados={dados.pets_por_especie} /></Card>
        <Card titulo="Por sexo"><Donut dados={dados.pets_por_sexo} /></Card>
        <Card titulo="Top raças"><BarrasH dados={dados.top_racas} cor="#074973" /></Card>
        <Card titulo="Pets por usuário" sub="Quantos pets cada tutor tem"><BarrasH dados={dados.pets_por_usuario} cor="#53789A" /></Card>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-marca-900">Atividade e cuidados</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card titulo="Saúde por categoria"><BarrasH dados={dados.saude_por_categoria} /></Card>
        <Card titulo="Banho e tosa por serviço"><BarrasH dados={dados.banho_por_servico} cor="#FF7A59" /></Card>
        <Card titulo="Despesas por categoria" sub="Soma dos valores"><BarrasH dados={dados.despesas_por_categoria} cor="#074973" formato="moeda" /></Card>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-marca-900">Engajamento</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi rotulo="Pets com foto" valor={pct(t.pets_com_foto, t.pets)} sub={`${t.pets_com_foto || 0} de ${t.pets || 0}`} />
        <Kpi rotulo="Usuários com avatar" valor={pct(t.usuarios_com_avatar, t.usuarios)} sub={`${t.usuarios_com_avatar || 0} de ${t.usuarios || 0}`} />
        <Kpi rotulo="Taxa de ativação" valor={pct(t.usuarios_ativos, t.usuarios)} sub="usuários com pet" />
        <Kpi rotulo="Novos (7 dias)" valor={`+${t.novos_usuarios_7d || 0}`} sub={`usuários · +${t.novos_pets_7d || 0} pets`} />
      </div>
    </>
  );
}

// --------------------------------------------------------------------------
function BuscaFiltro({ valor, onChange, placeholder, total, filtrado }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <input className="campo max-w-xs" placeholder={placeholder} value={valor} onChange={(e) => onChange(e.target.value)} />
      <span className="text-xs text-slate-500">{filtrado} de {total}</span>
    </div>
  );
}

function TabelaUsuarios({ lista }) {
  const [q, setQ] = useState("");
  if (lista === null) return <TelaCarregando />;
  const termo = q.trim().toLowerCase();
  const filtradas = termo
    ? lista.filter((u) => (u.nome || "").toLowerCase().includes(termo) || (u.email || "").toLowerCase().includes(termo))
    : lista;

  return (
    <Card>
      <BuscaFiltro valor={q} onChange={setQ} placeholder="Buscar por nome ou e-mail" total={lista.length} filtrado={filtradas.length} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3 font-medium">Nome</th>
              <th className="py-2 pr-3 font-medium">E-mail</th>
              <th className="py-2 pr-3 font-medium">Pets</th>
              <th className="py-2 pr-3 font-medium">Cadastro</th>
              <th className="py-2 pr-3 font-medium">Último acesso</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 pr-3">
                  <span className="font-medium text-marca-900">{u.nome || "—"}</span>
                  {u.is_admin && <span className="ml-2 rounded-full bg-acento-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">admin</span>}
                  {!u.confirmado && <span className="ml-2 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">não confirmado</span>}
                </td>
                <td className="py-2 pr-3 text-slate-600">{u.email || "—"}</td>
                <td className="py-2 pr-3 text-slate-700">{u.pets}</td>
                <td className="py-2 pr-3 text-slate-600">{soData(u.criado_em)}</td>
                <td className="py-2 pr-3 text-slate-600">{dataHora(u.ultimo_acesso)}</td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-slate-400">Nenhum usuário encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TabelaPets({ lista }) {
  const [q, setQ] = useState("");
  if (lista === null) return <TelaCarregando />;
  const termo = q.trim().toLowerCase();
  const filtradas = termo
    ? lista.filter((p) => [p.nome, p.raca, p.tutor_nome, p.tutor_email].some((x) => (x || "").toLowerCase().includes(termo)))
    : lista;

  return (
    <Card>
      <BuscaFiltro valor={q} onChange={setQ} placeholder="Buscar por pet, raça ou tutor" total={lista.length} filtrado={filtradas.length} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3 font-medium">Pet</th>
              <th className="py-2 pr-3 font-medium">Espécie</th>
              <th className="py-2 pr-3 font-medium">Raça</th>
              <th className="py-2 pr-3 font-medium">Sexo</th>
              <th className="py-2 pr-3 font-medium">Tutor</th>
              <th className="py-2 pr-3 font-medium">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-marca-100 text-xs font-semibold uppercase text-marca-700">
                      {p.foto_url ? <img src={p.foto_url} alt="" className="h-full w-full object-cover" /> : (p.nome || "?").charAt(0)}
                    </span>
                    <span className="font-medium text-marca-900">{p.nome || "—"}</span>
                  </div>
                </td>
                <td className="py-2 pr-3 capitalize text-slate-600">{p.especie || "—"}</td>
                <td className="py-2 pr-3 capitalize text-slate-600">{p.raca || "—"}</td>
                <td className="py-2 pr-3 capitalize text-slate-600">{p.sexo || "—"}</td>
                <td className="py-2 pr-3 text-slate-600">
                  <div className="text-marca-900">{p.tutor_nome || "—"}</div>
                  <div className="text-xs text-slate-400">{p.tutor_email || ""}</div>
                </td>
                <td className="py-2 pr-3 text-slate-600">{soData(p.criado_em)}</td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-slate-400">Nenhum pet encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
