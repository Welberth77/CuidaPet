import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNotif } from "../contexts/NotifContext.jsx";
import { useTema } from "../contexts/ThemeContext.jsx";
import Logo from "./art/Logo.jsx";
import { IconBell } from "./art/Icons.jsx";

const links = [
  { to: "/meus-pets", label: "Meus Pets" },
  { to: "/medicamentos-vacinas", label: "Vacinas" },
  { to: "/banho-tosa", label: "Banho e Tosa" },
  { to: "/despesas", label: "Despesas" },
];

export default function Header() {
  const { sair, perfil, ehAdmin } = useAuth();
  const { tema, alternar } = useTema();
  const { count } = useNotif();
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);

  async function handleSair() {
    await sair();
    navigate("/login");
  }

  const classe = ({ isActive }) =>
    "rounded-md px-3 py-2 text-sm font-medium transition-colors " +
    (isActive ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10");

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-marca-500 to-marca-700 text-white shadow-suave">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" aria-label="CuidaPet - início">
          <Logo tone="light" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={classe}>{l.label}</NavLink>
          ))}
          {ehAdmin && <NavLink to="/relatorios" className={classe}>Relatórios</NavLink>}

          <BotaoTema tema={tema} alternar={alternar} />

          <NavLink to="/notificacoes" className="relative ml-1 flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/10" title="Notificações" aria-label="Notificações">
            <IconBell width="20" height="20" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-acento-500 px-1 text-[10px] font-bold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </NavLink>

          <Link to="/perfil" className="ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-marca-900 text-sm font-semibold uppercase ring-2 ring-white/20" title={perfil?.nome || "Perfil"}>
            {perfil?.avatar_url
              ? <img src={perfil.avatar_url} alt="" className="h-full w-full object-cover" />
              : (perfil?.nome || "?").charAt(0)}
          </Link>
          <button onClick={handleSair} className="ml-1 rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10">Sair</button>
        </nav>

        <button className="md:hidden relative" onClick={() => setAberto((a) => !a)} aria-label="Menu">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          {count > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-acento-500" />}
        </button>
      </div>

      {aberto && (
        <nav className="flex flex-col gap-1 border-t border-white/15 px-4 pb-3 md:hidden">
          <NavLink to="/" end className={classe} onClick={() => setAberto(false)}>Início</NavLink>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={classe} onClick={() => setAberto(false)}>{l.label}</NavLink>
          ))}
          {ehAdmin && <NavLink to="/relatorios" className={classe} onClick={() => setAberto(false)}>Relatórios</NavLink>}
          <NavLink to="/notificacoes" className={classe} onClick={() => setAberto(false)}>
            Notificações{count > 0 ? ` (${count})` : ""}
          </NavLink>
          <NavLink to="/perfil" className={classe} onClick={() => setAberto(false)}>Meu Perfil</NavLink>
          <button onClick={alternar} className="rounded-md px-3 py-2 text-left text-sm font-medium text-white/90 hover:bg-white/10">
            {tema === "escuro" ? "Tema claro" : "Tema escuro"}
          </button>
          <button onClick={handleSair} className="rounded-md px-3 py-2 text-left text-sm font-medium text-white/90 hover:bg-white/10">Sair</button>
        </nav>
      )}
    </header>
  );
}

function BotaoTema({ tema, alternar }) {
  const escuro = tema === "escuro";
  return (
    <button
      onClick={alternar}
      aria-label={escuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-pressed={escuro}
      title={escuro ? "Tema claro" : "Tema escuro"}
      className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
    >
      {escuro ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
