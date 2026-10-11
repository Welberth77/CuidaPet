import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { traduzErroAuth } from "../utils/errosAuth.js";
import AuthShell from "../components/AuthShell.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function EsqueciSenha() {
  const { resetarSenha } = useAuth();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }
    setEnviando(true);
    try {
      await resetarSenha(email.trim());
      setEnviado(true);
    } catch (err) {
      setErro(traduzErroAuth(err.message));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell titulo="Recuperar senha" subtitulo="Enviaremos um link para você redefinir sua senha.">
      {enviado ? (
        <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
          Se existir uma conta com <strong>{email}</strong>, você receberá um e-mail com o link para
          redefinir a senha. Verifique também a caixa de spam.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="rotulo" htmlFor="email">E-mail</label>
            <input id="email" type="email" className="campo" placeholder="voce@email.com"
              autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}
          <button type="submit" className="btn-primario w-full" disabled={enviando}>
            {enviando ? <><Spinner size={18} className="mr-2 border-white/40 border-t-white" /> Enviando...</> : "Enviar link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link to="/login" className="font-semibold text-marca-500 hover:underline">Voltar para o login</Link>
      </p>
    </AuthShell>
  );
}
