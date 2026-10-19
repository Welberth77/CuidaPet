import { Link } from "react-router-dom";
import Logo from "./art/Logo.jsx";

export default function Footer() {
  return (
    <footer className="mt-16 bg-marca-900 text-white/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Logo tone="light" />
          <p className="mt-3 text-sm text-white/70">
            Facilite a vida do seu pet com apenas um clique.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Início</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/meus-pets" className="hover:underline">Meus Pets</Link></li>
            <li><Link to="/banho-tosa" className="hover:underline">Banho e Tosa</Link></li>
            <li><Link to="/medicamentos-vacinas" className="hover:underline">Vacinas</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Conta</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/perfil" className="hover:underline">Meu Perfil</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} CuidaPet
        {" · "}<Link to="/termos" className="hover:underline">Termos de Uso</Link>
        {" · "}<Link to="/privacidade" className="hover:underline">Política de Privacidade</Link>
      </div>
    </footer>
  );
}
