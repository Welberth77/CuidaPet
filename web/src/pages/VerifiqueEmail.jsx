import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { traduzErroAuth } from "../utils/errosAuth.js";
import AuthShell from "../components/AuthShell.jsx";

export default function VerifiqueEmail() {
  const { reenviarCodigo } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function reenviar() {
    setMsg(""); setErro("");
    if (!email.trim()) { setErro("Informe seu e-mail."); return; }
    setEnviando(true);
    try {
      await reenviarCodigo(email.trim()); // reenvia o e-mail de confirmacao
      setMsg("Reenviamos o e-mail de confirmação. Verifique sua caixa de entrada e o spam.");
    } catch (err) {
      setErro(traduzErroAuth(err.message));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell titulo="Verifique seu e-mail 📬" subtitulo="Enviamos um link de confirmação. Clique nele para ativar sua conta e entrar.">
      <div className="rounded-lg bg-marca-50 p-4 text-sm text-marca-800">
        {location.state?.email ? (
          <>Enviamos para <strong>{location.state.email}</strong>. Pode levar alguns minutos — confira também o spam.</>
        ) : (
          <>Confira sua caixa de entrada (e o spam) e clique no link de confirmação.</>
        )}
      </div>

      {!location.state?.email && (
        <div className="mt-4">
          <label className="rotulo" htmlFor="email">E-mail</label>
          <input id="email" type="email" className="campo" autoComplete="email"
            placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      )}

      {msg && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{msg}</p>}
      {erro && <p className="mt-4 text-sm font-medium text-red-600">{erro}</p>}

      <button onClick={reenviar} disabled={enviando} className="btn-secundario mt-4 w-full">
        {enviando ? "Reenviando..." : "Reenviar e-mail"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link to="/login" className="font-semibold text-marca-500 hover:underline">Voltar para o login</Link>
      </p>
    </AuthShell>
  );
}
