import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { traduzErroAuth } from "../utils/errosAuth.js";
import AuthShell from "../components/AuthShell.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirma: "" });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aceito, setAceito] = useState(false);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Preencha um nome válido.";
    if (!form.email.trim()) e.email = "Preencha um e-mail válido.";
    if (form.senha.length < 6) e.senha = "A senha precisa ter no mínimo 6 caracteres.";
    if (!form.confirma) e.confirma = "A confirmação de senha é obrigatória.";
    else if (form.confirma !== form.senha) e.confirma = "As senhas não são iguais.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setErroGeral("");
    if (!validar()) return;
    if (!aceito) return;
    setEnviando(true);
    try {
      const data = await cadastrar(form.nome.trim(), form.email.trim(), form.senha);
      if (data.session) {
        navigate("/");
      } else {
        // Confirmacao por e-mail ativa: avisa para clicar no link
        navigate("/verifique-email", { state: { email: form.email.trim() } });
      }
    } catch (err) {
      setErroGeral(traduzErroAuth(err.message));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell titulo="Crie sua conta CuidaPet">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="rotulo" htmlFor="nome">Nome completo</label>
          <input id="nome" type="text" autoComplete="name" maxLength={60}
            className={"campo " + (erros.nome ? "campo-erro" : "")}
            placeholder="Seu nome" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          {erros.nome && <p className="mt-1 text-xs font-medium text-red-600">{erros.nome}</p>}
        </div>
        <div>
          <label className="rotulo" htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="email" maxLength={120}
            className={"campo " + (erros.email ? "campo-erro" : "")}
            placeholder="voce@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          {erros.email && <p className="mt-1 text-xs font-medium text-red-600">{erros.email}</p>}
        </div>
        <div>
          <label className="rotulo" htmlFor="senha">Senha</label>
          <PasswordInput id="senha" value={form.senha} placeholder="Mínimo 6 caracteres"
            autoComplete="new-password" erro={erros.senha} onChange={(e) => set("senha", e.target.value)} />
          {erros.senha && <p className="mt-1 text-xs font-medium text-red-600">{erros.senha}</p>}
        </div>
        <div>
          <label className="rotulo" htmlFor="confirma">Confirmar senha</label>
          <PasswordInput id="confirma" value={form.confirma} placeholder="Repita a senha"
            autoComplete="new-password" erro={erros.confirma} onChange={(e) => set("confirma", e.target.value)} />
          {erros.confirma && <p className="mt-1 text-xs font-medium text-red-600">{erros.confirma}</p>}
        </div>

        {erroGeral && <p className="text-sm font-medium text-red-600">{erroGeral}</p>}

        <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-marca-500"
          />
          <span>
            Li e concordo com os{" "}
            <Link to="/termos" target="_blank" rel="noopener noreferrer" className="text-marca-500 dark:text-marca-300 hover:underline">Termos de Uso</Link> e a{" "}
            <Link to="/privacidade" target="_blank" rel="noopener noreferrer" className="text-marca-500 dark:text-marca-300 hover:underline">Política de Privacidade</Link>.
          </span>
        </label>

        <button type="submit" className="btn-primario w-full" disabled={enviando || !aceito}>
          {enviando ? <><Spinner size={18} className="mr-2 border-white/40 border-t-white" /> Cadastrando...</> : "Cadastrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-marca-500 dark:text-marca-300 hover:underline">Entrar</Link>
      </p>
    </AuthShell>
  );
}
