import { useState } from "react";
import PetAvatar from "./art/PetAvatar.jsx";
import { IconPaw, IconVaccine, IconBath, IconArrow } from "./art/Icons.jsx";

const EXEMPLOS = [
  { nome: "Thor", especie: "cachorro", raca: "Golden Retriever", idade: "3 anos" },
  { nome: "Mel", especie: "gato", raca: "Persa", idade: "2 anos" },
  { nome: "Bob", especie: "cachorro", raca: "Vira-lata", idade: "5 anos" },
  { nome: "Nina", especie: "gato", raca: "Siamês", idade: "1 ano" },
];

export default function Onboarding({ onCadastrar, onDepois }) {
  const [passo, setPasso] = useState(0);
  const [exemplo] = useState(() => EXEMPLOS[Math.floor(Math.random() * EXEMPLOS.length)]);

  const passos = [
    {
      titulo: "Bem-vindo ao CuidaPet! 🐾",
      corpo: (
        <p className="text-slate-600">
          Aqui você organiza todos os cuidados dos seus pets em um só lugar: saúde, vacinas,
          banho e tosa — com lembretes para nunca esquecer nada. Vamos ver como funciona em
          3 passinhos rápidos.
        </p>
      ),
    },
    {
      titulo: "Assim fica o seu pet",
      corpo: (
        <div>
          <p className="mb-4 text-slate-600">
            Cada pet tem um perfil com foto e informações. Veja um exemplo:
          </p>
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <PetAvatar especie={exemplo.especie} size={56} />
            <div>
              <p className="font-bold text-marca-900">{exemplo.nome}</p>
              <p className="text-sm text-slate-500">
                {exemplo.especie === "gato" ? "Gato" : "Cachorro"} · {exemplo.raca} · {exemplo.idade}
              </p>
              <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Vacinas em dia
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">* pet de exemplo, só para ilustrar 🙂</p>
        </div>
      ),
    },
    {
      titulo: "O que dá para fazer",
      corpo: (
        <ul className="space-y-3">
          {[
            { Icone: IconPaw, t: "Cadastrar seus pets", d: "Com foto, raça, peso e observações." },
            { Icone: IconVaccine, t: "Registrar vacinas e medicamentos", d: "E a data da próxima dose." },
            { Icone: IconBath, t: "Acompanhar banho e tosa", d: "E ver tudo que está por vir na tela inicial." },
          ].map(({ Icone, t, d }) => (
            <li key={t} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-marca-500/10 text-marca-500">
                <Icone width="18" height="18" />
              </span>
              <div>
                <p className="font-medium text-marca-900">{t}</p>
                <p className="text-sm text-slate-500">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      ),
    },
    {
      titulo: "Vamos cadastrar seu primeiro pet?",
      corpo: (
        <p className="text-slate-600">
          É rapidinho — e depois de cadastrar você já pode registrar vacinas e banhos.
          Se preferir, pode deixar para depois e explorar o app antes.
        </p>
      ),
    },
  ];

  const ultimo = passo === passos.length - 1;
  const atual = passos[passo];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-suave sm:p-8">
        {/* indicador de passos */}
        <div className="mb-5 flex gap-1.5">
          {passos.map((_, i) => (
            <span key={i} className={"h-1.5 flex-1 rounded-full " + (i <= passo ? "bg-marca-500" : "bg-slate-200")} />
          ))}
        </div>

        <h2 className="text-xl font-bold text-marca-900">{atual.titulo}</h2>
        <div className="mt-3">{atual.corpo}</div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button onClick={onDepois} className="text-sm font-medium text-slate-500 hover:text-slate-700">
            {ultimo ? "Cadastrar depois" : "Pular"}
          </button>
          {ultimo ? (
            <button onClick={onCadastrar} className="btn-primario inline-flex items-center gap-2">
              Cadastrar meu pet <IconArrow width="18" height="18" />
            </button>
          ) : (
            <button onClick={() => setPasso((p) => p + 1)} className="btn-primario inline-flex items-center gap-2">
              Continuar <IconArrow width="18" height="18" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
