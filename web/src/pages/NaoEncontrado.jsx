import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Logo from "../components/art/Logo.jsx";
import PetLost from "../components/art/PetLost.jsx";

export default function NaoEncontrado() {
  const { usuario } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5 text-center">
      <Logo size={40} />
      <PetLost className="mt-6 w-64" />
      <h1 className="mt-2 text-3xl font-black text-marca-900">Página não encontrada</h1>
      <p className="mt-2 max-w-sm text-slate-600">
        Parece que essa página fugiu como um bichinho esperto. Vamos te levar de volta?
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Link to="/" className="btn-primario">{usuario ? "Ir para o início" : "Ir para a página inicial"}</Link>
        {!usuario && <Link to="/login" className="btn-secundario">Entrar</Link>}
      </div>
    </div>
  );
}
