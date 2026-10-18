// Formata "YYYY-MM-DD" para "DD/MM/AAAA"
export function formatar(iso) {
  if (!iso) return "-";
  const [a, m, d] = String(iso).split("-");
  return d ? `${d}/${m}/${a}` : iso;
}

// Data de hoje em "YYYY-MM-DD"
export function hoje() {
  return new Date().toISOString().split("T")[0];
}

// Dias a partir de hoje (negativo = no passado)
export function diasAte(iso) {
  if (!iso) return null;
  const alvo = new Date(iso + "T00:00:00");
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  return Math.round((alvo - base) / 86400000);
}

// "atrasado" | "proximo" (<=7 dias) | "ok" | null
export function statusData(iso, janela = 7) {
  const d = diasAte(iso);
  if (d === null) return null;
  if (d < 0) return "atrasado";
  if (d <= janela) return "proximo";
  return "ok";
}

export function rotuloPrazo(iso) {
  const d = diasAte(iso);
  if (d === null) return "";
  if (d < 0) return `atrasado há ${Math.abs(d)} ${Math.abs(d) === 1 ? "dia" : "dias"}`;
  if (d === 0) return "hoje";
  if (d === 1) return "amanhã";
  return `em ${d} dias`;
}


// Idade a partir da data de nascimento (YYYY-MM-DD) em texto amigavel.
export function idadeTexto(iso) {
  if (!iso) return null;
  const n = new Date(iso + "T00:00:00");
  if (isNaN(n)) return null;
  const h = new Date();
  let anos = h.getFullYear() - n.getFullYear();
  let meses = h.getMonth() - n.getMonth();
  if (h.getDate() < n.getDate()) meses--;
  if (meses < 0) { anos--; meses += 12; }
  if (anos < 0) return null;
  if (anos === 0 && meses === 0) return "recém-nascido";
  if (anos === 0) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  if (meses === 0) return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  return `${anos} ${anos === 1 ? "ano" : "anos"} e ${meses} ${meses === 1 ? "mês" : "meses"}`;
}

// Valor numerico em R$ (ex.: 12.5 -> "R$ 12,50")
export function moeda(v) {
  const n = Number(v) || 0;
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Verifica se hoje e o aniversario (mesmo dia e mes) do nascimento informado.
export function ehAniversarioHoje(iso) {
  if (!iso) return false;
  const n = new Date(iso + "T00:00:00");
  if (isNaN(n)) return false;
  const h = new Date();
  return n.getDate() === h.getDate() && n.getMonth() === h.getMonth();
}

// Quantos anos o pet completa (0 se nasceu hoje).
export function anosFazendo(iso) {
  if (!iso) return null;
  const n = new Date(iso + "T00:00:00");
  if (isNaN(n)) return null;
  return new Date().getFullYear() - n.getFullYear();
}

// --- Limites de data para os formularios -------------------------------------
// Piso para datas de eventos ja ocorridos (nascimento, consultas, banho...).
export const DATA_MINIMA = "1990-01-01";

// Data maxima no futuro (hoje + anos) em "YYYY-MM-DD" — para agendamentos.
export function maxFuturo(anos = 5) {
  const dt = new Date();
  dt.setFullYear(dt.getFullYear() + anos);
  return dt.toISOString().split("T")[0];
}

// Duracao amigavel entre duas datas ISO (ex.: "3 anos e 2 meses").
export function duracaoTexto(iniIso, fimIso) {
  if (!iniIso || !fimIso) return null;
  const a = new Date(iniIso + "T00:00:00");
  const b = new Date(fimIso + "T00:00:00");
  if (isNaN(a) || isNaN(b) || b < a) return null;
  let anos = b.getFullYear() - a.getFullYear();
  let meses = b.getMonth() - a.getMonth();
  if (b.getDate() < a.getDate()) meses--;
  if (meses < 0) { anos--; meses += 12; }
  const pa = anos > 0 ? `${anos} ${anos === 1 ? "ano" : "anos"}` : "";
  const pm = meses > 0 ? `${meses} ${meses === 1 ? "mês" : "meses"}` : "";
  if (pa && pm) return `${pa} e ${pm}`;
  if (pa) return pa;
  if (pm) return pm;
  return "menos de um mês";
}
