import { statusData, formatar, rotuloPrazo } from "../../utils/datas.js";

export default function BadgePrazo({ iso }) {
  if (!iso) return <span className="text-slate-400">-</span>;
  const st = statusData(iso);
  const cor =
    st === "atrasado" ? "bg-red-100 text-red-700"
    : st === "proximo" ? "bg-amber-100 text-amber-700"
    : "bg-slate-100 text-slate-600";
  return (
    <span className="inline-flex flex-col gap-0.5">
      <span className="text-slate-700">{formatar(iso)}</span>
      {st !== "ok" && (
        <span className={"w-fit rounded-full px-2 py-0.5 text-[11px] font-medium " + cor}>{rotuloPrazo(iso)}</span>
      )}
    </span>
  );
}
