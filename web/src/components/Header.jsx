import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Logo from "./art/Logo.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/meus-pets", label: "Meus Pets" },
  { to: "/medicamentos-vacinas", label: "Vacinas" },
  { to: "/banho-tosa", label: "Banho e Tosa" },
];

export default function Header() {
  const { sair, perfil } = useAuth();
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
            <NavLink key={l.to} to={l.to} end={l.end} className={classe}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/perfil"
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-marca-900 text-sm font-semibold uppercase ring-2 ring-white/20"
            title={perfil?.nome || "Perfil"}
          >
            {(perfil?.nome || "?").charAt(0)}
          </Link>
          <button onClick={handleSair} className="ml-1 rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
            Sair
          </button>
        </nav>

        <button className="md:hidden" onClick={() => setAberto((a) => !a)} aria-label="Menu">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {aberto && (
        <nav className="flex flex-col gap-1 border-t border-white/15 px-4 pb-3 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={classe} onClick={() => setAberto(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/perfil" className={classe} onClick={() => setAberto(false)}>Meu Perfil</NavLink>
          <button onClick={handleSair} className="rounded-md px-3 py-2 text-left text-sm font-medium text-white/90 hover:bg-white/10">
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
