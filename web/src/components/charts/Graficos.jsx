// Graficos leves em SVG/CSS (sem dependencias) para a tela de Relatorios.
import { moeda } from "../../utils/datas.js";

// Paleta categorica derivada da marca do app
export const CORES = ["#0B7ABF", "#FF7A59", "#074973", "#FFB59A", "#53789A", "#94A3B8", "#0EA5E9", "#F2623D"];

// ---- Cartao de KPI ---------------------------------------------------------
export function Kpi({ rotulo, valor, sub, destaque }) {
  return (
    <div className={"rounded-xl border p-4 " + (destaque ? "border-marca-200 bg-marca-50" : "border-slate-200 bg-white")}>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{rotulo}</div>
      <div className="mt-1 text-2xl font-bold text-marca-900">{valor}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

// ---- Barras horizontais ----------------------------------------------------
export function BarrasH({ dados = [], cor = "#0B7ABF", formato }) {
  if (!dados.length) return <Vazio />;
  const max = Math.max(...dados.map((d) => Number(d.valor) || 0), 1);
  const fmt = formato === "moeda" ? (v) => moeda(v) : (v) => Number(v).toLocaleString("pt-BR");
  return (
    <div className="space-y-2.5">
      {dados.map((d, i) => {
        const v = Number(d.valor) || 0;
        const pct = Math.max((v / max) * 100, 2);
        return (
          <div key={i}>
            <div className="mb-0.5 flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate text-slate-700">{d.rotulo}</span>
              <span className="shrink-0 font-semibold text-marca-900">{fmt(v)}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full" style={{ width: pct + "%", backgroundColor: cor }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Colunas mensais (serie temporal) -------------------------------------
const MESES_ABREV = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
function rotuloMes(iso) {
  const [a, m] = String(iso).split("-");
  return MESES_ABREV[Number(m) - 1] + "/" + a.slice(2);
}
export function ColunasMensais({ dados = [], cor = "#0B7ABF" }) {
  if (!dados.length) return <Vazio />;
  const max = Math.max(...dados.map((d) => Number(d.total) || 0), 1);
  const totalPeriodo = dados.reduce((s, d) => s + (Number(d.total) || 0), 0);
  return (
    <div>
      <div className="mb-3 text-sm text-slate-500">{totalPeriodo.toLocaleString("pt-BR")} no período</div>
      <div className="flex h-40 items-end gap-1">
        {dados.map((d, i) => {
          const v = Number(d.total) || 0;
          const h = Math.max((v / max) * 100, v > 0 ? 4 : 1.5);
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end" title={`${rotuloMes(d.mes)}: ${v}`}>
              <span className="mb-1 text-[10px] font-semibold text-marca-700">{v > 0 ? v : ""}</span>
              <div className="w-full rounded-t" style={{ height: h + "%", backgroundColor: v > 0 ? cor : "#E2E8F0" }} />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-1">
        {dados.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[9px] text-slate-400">{rotuloMes(d.mes)}</div>
        ))}
      </div>
    </div>
  );
}

// ---- Donut -----------------------------------------------------------------
export function Donut({ dados = [] }) {
  const itens = dados.map((d) => ({ ...d, valor: Number(d.valor) || 0 })).filter((d) => d.valor > 0);
  const total = itens.reduce((s, d) => s + d.valor, 0);
  if (!total) return <Vazio />;
  const R = 60, SW = 22, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg width="150" height="150" viewBox="0 0 150 150" className="shrink-0">
        <g transform="translate(75,75) rotate(-90)">
          <circle r={R} fill="none" stroke="#F1F5F9" strokeWidth={SW} />
          {itens.map((d, i) => {
            const frac = d.valor / total;
            const dash = frac * C;
            const el = (
              <circle key={i} r={R} fill="none" stroke={CORES[i % CORES.length]} strokeWidth={SW}
                strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc} />
            );
            acc += dash;
            return el;
          })}
        </g>
        <text x="75" y="71" textAnchor="middle" className="fill-marca-900" style={{ fontSize: 22, fontWeight: 700 }}>{total}</text>
        <text x="75" y="88" textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>total</text>
      </svg>
      <div className="space-y-1.5 text-sm">
        {itens.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: CORES[i % CORES.length] }} />
            <span className="text-slate-700">{d.rotulo}</span>
            <span className="font-semibold text-marca-900">{d.valor}</span>
            <span className="text-xs text-slate-400">({Math.round((d.valor / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Vazio() {
  return <div className="flex h-24 items-center justify-center text-sm text-slate-400">Sem dados ainda</div>;
}
