import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import AuthShell from "../components/AuthShell.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function Confirmado() {
  const { usuario, carregando } = useAuth();
  const navigate = useNavigate();
  const [erroHash, setErroHash] = useState("");

  useEffect(() => {
    // Supabase devolve erros no hash da URL (ex.: link expirado)
    const h = window.location.hash || "";
    if (h.includes("error")) {
      const params = new URLSearchParams(h.replace(/^#/, ""));
      setErroHash(params.get("error_description") || "Link inválido ou expirado.");
    }
  }, []);

  if (carregando) {
    return (
      <AuthShell titulo="Confirmando seu e-mail...">
        <div className="flex justify-center py-6"><Spinner size={34} /></div>
      </AuthShell>
    );
  }

  if (usuario) {
    return (
      <AuthShell titulo="E-mail confirmado! 🎉" subtitulo="Sua conta está ativa e você já está logado.">
        <button onClick={() => navigate("/")} className="btn-primario w-full">Ir para o app</button>
      </AuthShell>
    );
  }

  return (
    <AuthShell titulo="Não foi possível confirmar" subtitulo={erroHash || "O link pode ter expirado ou já ter sido usado."}>
      <div className="space-y-3">
        <Link to="/verifique-email" className="btn-primario w-full">Reenviar e-mail de confirmação</Link>
        <Link to="/login" className="btn-secundario w-full">Voltar para o login</Link>
      </div>
    </AuthShell>
  );
}
