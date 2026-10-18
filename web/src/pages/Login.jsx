import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { traduzErroAuth } from "../utils/errosAuth.js";
import AuthShell from "../components/AuthShell.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const aviso = location.state?.aviso;
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setEnviando(true);
    try {
      await entrar(email.trim(), senha);
      navigate("/");
    } catch (err) {
      if (String(err.message || "").toLowerCase().includes("not confirmed")) {
        navigate("/verifique-email", { state: { email: email.trim() } });
        return;
      }
      setErro(traduzErroAuth(err.message));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell titulo="Entre com sua conta CuidaPet">
      {aviso && (
        <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{aviso}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="rotulo" htmlFor="email">E-mail</label>
          <input id="email" type="email" className="campo" placeholder="voce@email.com"
            autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="rotulo mb-0" htmlFor="senha">Senha</label>
            <Link to="/esqueci-senha" className="text-xs font-medium text-marca-500 dark:text-marca-300 hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <PasswordInput id="senha" value={senha} placeholder="Sua senha"
            autoComplete="current-password" onChange={(e) => setSenha(e.target.value)} />
        </div>

        {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}

        <button type="submit" className="btn-primario w-full" disabled={enviando}>
          {enviando ? <><Spinner size={18} className="mr-2 border-white/40 border-t-white" /> Entrando...</> : "Entrar"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
        NÃO TEM CADASTRO?
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
      </div>

      <Link to="/cadastro" className="btn-secundario w-full">Cadastre-se aqui</Link>
    </AuthShell>
  );
}
