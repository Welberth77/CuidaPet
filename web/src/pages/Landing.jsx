import { Link } from "react-router-dom";
import Logo from "../components/art/Logo.jsx";
import HeroArt from "../components/art/HeroArt.jsx";
import {
  IconPaw, IconVaccine, IconBath, IconBell, IconUser, IconHeart, IconArrow,
} from "../components/art/Icons.jsx";

const funcionalidades = [
  { Icone: IconPaw, titulo: "Vários pets num só lugar", desc: "Cadastre todos os seus animais com foto, raça, peso e histórico — cada um com seu próprio perfil." },
  { Icone: IconVaccine, titulo: "Carteira de saúde", desc: "Registre vacinas e medicamentos e tenha todo o histórico de saúde sempre à mão." },
  { Icone: IconBath, titulo: "Banho e tosa", desc: "Acompanhe os cuidados de higiene e saiba quando foi o último e quando é o próximo." },
  { Icone: IconBell, titulo: "Lembretes de cuidados", desc: "Veja o que está atrasado e o que vem nos próximos dias logo na tela inicial." },
  { Icone: IconHeart, titulo: "Simples e acolhedor", desc: "Uma interface leve, feita para quem ama seus pets e quer praticidade no dia a dia." },
  { Icone: IconUser, titulo: "Seus dados protegidos", desc: "Cada tutor acessa apenas os próprios pets, com login seguro." },
];

const passos = [
  { n: "1", titulo: "Crie sua conta", desc: "Leva menos de um minuto, só com e-mail e senha." },
  { n: "2", titulo: "Cadastre seus pets", desc: "Adicione foto e informações de cada animal." },
  { n: "3", titulo: "Acompanhe os cuidados", desc: "Registre vacinas e banhos e receba os lembretes." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-marca-900">
      {/* Topo */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-marca-700 hover:bg-marca-50">Entrar</Link>
            <Link to="/cadastro" className="btn-primario px-4 py-2 text-sm">Criar conta grátis</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-marca-50 px-3 py-1 text-sm font-medium text-marca-700">
              🐾 Cuidar do seu pet ficou simples
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              Todos os cuidados do seu pet em <span className="text-marca-500">um só lugar</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-slate-600">
              Organize vacinas, medicamentos, banho e tosa, receba lembretes e nunca mais perca
              uma data importante da saúde do seu melhor amigo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cadastro" className="btn-primario inline-flex items-center gap-2">
                Começar agora — é grátis <IconArrow width="18" height="18" />
              </Link>
              <Link to="/login" className="btn-secundario">Já tenho conta</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-marca-50 blur-2xl" />
            <HeroArt className="mx-auto w-full max-w-md" />
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Tudo o que você precisa para cuidar bem</h2>
            <p className="mt-3 text-slate-600">
              O CuidaPet reúne as informações que hoje ficam espalhadas em papéis, mensagens e na memória.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {funcionalidades.map(({ Icone, titulo, desc }) => (
              <div key={titulo} className="cartao">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-marca-500/10 text-marca-500">
                  <Icone />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{titulo}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Como funciona</h2>
            <p className="mt-3 text-slate-600">Em três passos você já está no controle.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {passos.map((p) => (
              <div key={p.n} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-marca-500 text-xl font-black text-white">
                  {p.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-4 pb-16 md:pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-marca-500 to-marca-900 px-6 py-14 text-center text-white shadow-suave">
          <h2 className="text-3xl font-bold sm:text-4xl">Pronto para organizar a vida do seu pet?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Crie sua conta gratuita e comece a cuidar melhor hoje mesmo.
          </p>
          <Link to="/cadastro" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-marca-700 transition hover:bg-white/90">
            Criar conta grátis <IconArrow width="18" height="18" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} CuidaPet — feito com carinho para quem ama seus pets.</p>
        </div>
      </footer>
    </div>
  );
}
