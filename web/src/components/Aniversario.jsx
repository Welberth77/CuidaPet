import { useMemo, useState } from "react";
import PetAvatar from "./art/PetAvatar.jsx";

const CORES = ["#0B7ABF", "#F2762E", "#FFD166", "#06D6A0", "#EF476F", "#F6A877", "#118AB2"];
const r = (min, max) => Math.random() * (max - min) + min;

function gerarConfetes(qtd) {
  return Array.from({ length: qtd }, (_, i) => ({
    id: i,
    left: r(0, 100),
    size: r(7, 13),
    cor: CORES[Math.floor(Math.random() * CORES.length)],
    dur: r(2.6, 5),
    delay: r(0, 3),
    redondo: Math.random() > 0.5,
  }));
}

function Confetes({ seed }) {
  const pecas = useMemo(() => gerarConfetes(130), [seed]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[101] overflow-hidden">
      {pecas.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-12vh",
            left: p.left + "vw",
            width: p.size,
            height: p.size * (p.redondo ? 1 : 1.6),
            background: p.cor,
            borderRadius: p.redondo ? "50%" : "2px",
            animation: `confete ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ChapeuFesta() {
  return (
    <svg width="72" height="64" viewBox="0 0 72 64" className="drop-shadow" aria-hidden="true">
      <defs>
        <linearGradient id="hat" x1="0" y1="0" x2="72" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2762E" /><stop offset="1" stopColor="#EF476F" />
        </linearGradient>
      </defs>
      <path d="M36 2 L60 54 H12 Z" fill="url(#hat)" />
      <path d="M22 30 q7 6 14 0 M28 44 q7 6 14 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
      <ellipse cx="36" cy="54" rx="26" ry="5" fill="#FFD166" />
      <circle cx="36" cy="2" r="6" fill="#FFD166" />
    </svg>
  );
}

function Balao({ cor, className }) {
  return (
    <svg width="60" height="86" viewBox="0 0 60 86" className={className} aria-hidden="true">
      <ellipse cx="30" cy="30" rx="26" ry="30" fill={cor} />
      <ellipse cx="22" cy="20" rx="7" ry="9" fill="#ffffff" opacity="0.35" />
      <path d="M30 60 l-4 6 h8 z" fill={cor} />
      <path d="M30 66 q6 10 0 20" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function Aniversario({ pet, anos, onFechar }) {
  const [seed, setSeed] = useState(0);

  const textoIdade =
    anos === 0
      ? "nasceu hoje! 🐣"
      : `completa ${anos} ${anos === 1 ? "aninho" : "aninhos"} hoje! 🥳`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-marca-700/95 to-marca-900/95 p-4">
      <Confetes seed={seed} />

      <div className="relative z-[102] w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-8 text-center shadow-suave" style={{ animation: "popar .4s ease-out" }}>
        <Balao cor="#F2762E" className="absolute -left-6 -top-8 hidden sm:block" />
        <Balao cor="#06D6A0" className="absolute -right-6 -top-10 hidden sm:block" />

        <div className="relative mx-auto w-fit">
          <div className="absolute -top-9 left-1/2 -translate-x-1/2" style={{ animation: "balancar 2.4s ease-in-out infinite", transformOrigin: "bottom center" }}>
            <ChapeuFesta />
          </div>
          <PetAvatar especie={pet.especie} fotoUrl={pet.foto_url} size={128} ampliavel className="ring-4 ring-acento-300" />
        </div>

        <h2 className="mt-5 text-2xl font-black text-marca-900 dark:text-slate-100">
          Feliz aniversário, {pet.nome}! 🎉
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Hoje <strong className="text-marca-700 dark:text-marca-200">{pet.nome}</strong> {textoIdade}
        </p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Que venham muitos passeios, petiscos e carinho. 🐾🎂
        </p>

        <div className="mt-7 flex flex-col gap-2">
          <button onClick={() => setSeed((s) => s + 1)} className="btn-primario w-full">
            🎉 Soltar mais confete!
          </button>
          <button onClick={onFechar} className="btn-secundario w-full">Fechar</button>
        </div>
      </div>
    </div>
  );
}
