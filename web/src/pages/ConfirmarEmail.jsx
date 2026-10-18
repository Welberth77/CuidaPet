import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { traduzErroAuth } from "../utils/errosAuth.js";
import AuthShell from "../components/AuthShell.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function ConfirmarEmail() {
  const { confirmarCodigo, reenviarCodigo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(""); setMsg("");
    if (!email.trim()) { setErro("Informe seu e-mail."); return; }
    if (codigo.trim().length < 6) { setErro("Digite o código de 6 dígitos."); return; }
    setEnviando(true);
    try {
      await confirmarCodigo(email.trim(), codigo.trim());
      navigate("/");
    } catch (err) {
      setErro(traduzErroAuth(err.message));
    } finally {
      setEnviando(false);
    }
  }

  async function reenviar() {
    setErro(""); setMsg("");
    if (!email.trim()) { setErro("Informe seu e-mail para reenviar."); return; }
    setReenviando(true);
    try {
      await reenviarCodigo(email.trim());
      setMsg("Enviamos um novo código para o seu e-mail.");
    } catch (err) {
      setErro(traduzErroAuth(err.message));
    } finally {
      setReenviando(false);
    }
  }

  return (
    <AuthShell titulo="Confirme seu e-mail" subtitulo="Enviamos um código de 6 dígitos para o seu e-mail. Digite-o abaixo para ativar sua conta.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {!location.state?.email && (
          <div>
            <label className="rotulo" htmlFor="email">E-mail</label>
            <input id="email" type="email" className="campo" autoComplete="email"
              placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        )}
        <div>
          <label className="rotulo" htmlFor="codigo">Código de confirmação</label>
          <input id="codigo" inputMode="numeric" maxLength={6}
            className="campo text-center text-2xl font-bold tracking-[0.5em]"
            placeholder="000000" value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))} />
        </div>

        {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}
        {msg && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{msg}</p>}

        <button type="submit" className="btn-primario w-full" disabled={enviando}>
          {enviando ? <><Spinner size={18} className="mr-2 border-white/40 border-t-white" /> Confirmando...</> : "Confirmar e entrar"}
        </button>
      </form>

      <button onClick={reenviar} disabled={reenviando}
        className="mt-4 w-full text-center text-sm font-medium text-marca-500 dark:text-marca-300 hover:underline disabled:opacity-60">
        {reenviando ? "Reenviando..." : "Reenviar código"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="font-semibold text-marca-500 dark:text-marca-300 hover:underline">Voltar para o login</Link>
      </p>
    </AuthShell>
  );
}
