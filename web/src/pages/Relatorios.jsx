import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { TelaCarregando } from "../components/ui/Spinner.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { obterRelatorio } from "../services/relatorios.js";
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

function pct(a, b) {
  if (!b) return "0%";
  return Math.round((a / b) * 100) + "%";
}

export default function Relatorios() {
  const toast = useToast();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro(false);
    try {
      const d = await obterRelatorio();
      setDados(d);
    } catch (e) {
      setErro(true);
      toast.erro("Não foi possível carregar os relatórios.");
    } finally {
      setCarregando(false);
    }
  }
  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, []);

  if (carregando) {
    return <Layout><TelaCarregando /></Layout>;
  }

  if (erro || !dados) {
    return (
      <Layout>
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-suave">
          <p className="text-slate-600">Não foi possível carregar os relatórios.</p>
          <button onClick={carregar} className="btn-primario mt-4">Tentar novamente</button>
        </div>
      </Layout>
    );
  }

  const t = dados.totais || {};
  const geradoEm = dados.gerado_em ? new Date(dados.gerado_em).toLocaleString("pt-BR") : "";
  const mediaPets = t.usuarios ? (t.pets / t.usuarios).toFixed(1) : "0";

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-marca-900">Relatórios</h1>
          <p className="text-sm text-slate-500">Visão geral da evolução do CuidaPet{geradoEm ? ` · atualizado em ${geradoEm}` : ""}</p>
        </div>
        <button onClick={carregar} className="btn-secundario text-sm">Atualizar</button>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Kpi rotulo="Usuários" valor={(t.usuarios || 0).toLocaleString("pt-BR")} sub={`${t.usuarios_confirmados || 0} confirmados (${pct(t.usuarios_confirmados, t.usuarios)})`} destaque />
        <Kpi rotulo="Pets cadastrados" valor={(t.pets || 0).toLocaleString("pt-BR")} sub={`${mediaPets} por usuário`} destaque />
        <Kpi rotulo="Usuários ativos" valor={(t.usuarios_ativos || 0).toLocaleString("pt-BR")} sub={`com pelo menos 1 pet (${pct(t.usuarios_ativos, t.usuarios)})`} />
        <Kpi rotulo="Compartilhamentos" valor={(t.compartilhamentos || 0).toLocaleString("pt-BR")} sub={`${t.compartilhamentos_aceitos || 0} aceitos`} />
        <Kpi rotulo="Registros de saúde" valor={(t.saude || 0).toLocaleString("pt-BR")} sub="vacinas e medicamentos" />
        <Kpi rotulo="Banho e tosa" valor={(t.banho || 0).toLocaleString("pt-BR")} sub="registros" />
        <Kpi rotulo="Despesas" valor={moeda(t.despesas_total || 0)} sub={`${t.despesas_qtd || 0} lançamentos`} />
        <Kpi rotulo="Novos (30 dias)" valor={`+${t.novos_usuarios_30d || 0}`} sub={`usuários · +${t.novos_pets_30d || 0} pets`} />
      </div>

      {/* Crescimento */}
      <h2 className="mb-3 mt-8 text-lg font-semibold text-marca-900">Crescimento</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Novos usuários por mês" sub="Últimos 12 meses">
          <ColunasMensais dados={dados.usuarios_por_mes} cor="#0B7ABF" />
        </Card>
        <Card titulo="Novos pets por mês" sub="Últimos 12 meses">
          <ColunasMensais dados={dados.pets_por_mes} cor="#FF7A59" />
        </Card>
      </div>

      {/* Pets */}
      <h2 className="mb-3 mt-8 text-lg font-semibold text-marca-900">Perfil dos pets</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Por espécie"><BarrasH dados={dados.pets_por_especie} /></Card>
        <Card titulo="Por sexo"><Donut dados={dados.pets_por_sexo} /></Card>
        <Card titulo="Top raças"><BarrasH dados={dados.top_racas} cor="#074973" /></Card>
        <Card titulo="Pets por usuário" sub="Distribuição de quantos pets cada tutor tem">
          <BarrasH dados={dados.pets_por_usuario} cor="#53789A" />
        </Card>
      </div>

      {/* Atividade */}
      <h2 className="mb-3 mt-8 text-lg font-semibold text-marca-900">Atividade e cuidados</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card titulo="Saúde por categoria"><BarrasH dados={dados.saude_por_categoria} /></Card>
        <Card titulo="Banho e tosa por serviço"><BarrasH dados={dados.banho_por_servico} cor="#FF7A59" /></Card>
        <Card titulo="Despesas por categoria" sub="Soma dos valores"><BarrasH dados={dados.despesas_por_categoria} cor="#074973" formato="moeda" /></Card>
      </div>

      {/* Engajamento */}
      <h2 className="mb-3 mt-8 text-lg font-semibold text-marca-900">Engajamento</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi rotulo="Pets com foto" valor={pct(t.pets_com_foto, t.pets)} sub={`${t.pets_com_foto || 0} de ${t.pets || 0}`} />
        <Kpi rotulo="Usuários com avatar" valor={pct(t.usuarios_com_avatar, t.usuarios)} sub={`${t.usuarios_com_avatar || 0} de ${t.usuarios || 0}`} />
        <Kpi rotulo="Taxa de ativação" valor={pct(t.usuarios_ativos, t.usuarios)} sub="usuários com pet" />
        <Kpi rotulo="Novos (7 dias)" valor={`+${t.novos_usuarios_7d || 0}`} sub={`usuários · +${t.novos_pets_7d || 0} pets`} />
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">Dados agregados de toda a base — visível apenas para administradores.</p>
    </Layout>
  );
}
