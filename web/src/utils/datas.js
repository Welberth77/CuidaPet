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
