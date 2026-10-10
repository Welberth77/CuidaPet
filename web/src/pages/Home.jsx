import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import HeroArt from "../components/art/HeroArt.jsx";
import { IconPaw, IconVaccine, IconBath, IconUser, IconArrow } from "../components/art/Icons.jsx";

const servicos = [
  { to: "/meus-pets", Icone: IconPaw, titulo: "Meus Pets", desc: "Gerencie as informações dos seus pets em um só lugar." },
  { to: "/medicamentos-vacinas", Icone: IconVaccine, titulo: "Medicamentos e Vacinas", desc: "Organize vacinas e medicamentos para garantir a saúde do seu pet." },
  { to: "/banho-tosa", Icone: IconBath, titulo: "Banho e Tosa", desc: "Acompanhe o histórico e registre novos cuidados." },
  { to: "/perfil", Icone: IconUser, titulo: "Meu Perfil", desc: "Veja e edite as informações da sua conta." },
];

export default function Home() {
  const { perfil } = useAuth();
  const primeiroNome = (perfil?.nome || "").split(" ")[0];

  return (
    <Layout>
      <section className="mb-10 grid items-center gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-marca-500 to-marca-900 px-6 py-10 text-white shadow-suave sm:px-10 md:grid-cols-[1fr_280px]">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Olá{primeiroNome ? `, ${primeiroNome}` : ""}! 🐾
          </h1>
          <p className="mt-3 max-w-xl text-white/85">
            Bem-vindo ao CuidaPet. Organize os cuidados dos seus pets, registre vacinas e
            acompanhe banho e tosa — tudo em um só lugar.
          </p>
          <Link to="/meus-pets" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-marca-700 transition hover:bg-white/90">
            Ver meus pets <IconArrow width="18" height="18" />
          </Link>
        </div>
        <HeroArt className="mx-auto hidden w-64 md:block" />
      </section>

      <h2 className="mb-4 text-xl font-bold text-marca-900">Perfil e serviços</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {servicos.map(({ to, Icone, titulo, desc }) => (
          <Link key={to} to={to} className="cartao group flex items-start gap-4 transition hover:-translate-y-0.5 hover:shadow-suave">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-marca-500/10 text-marca-500 transition group-hover:bg-marca-500 group-hover:text-white">
              <Icone />
            </span>
            <div>
              <h3 className="font-semibold text-marca-900">{titulo}</h3>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
