import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { traduzErroAuth } from "../utils/errosAuth.js";
import AuthShell from "../components/AuthShell.jsx";

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirma: "" });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

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
    setEnviando(true);
    try {
      const data = await cadastrar(form.nome.trim(), form.email.trim(), form.senha);
      if (data.session) {
        navigate("/");
      } else {
        // Confirmacao por e-mail ativa no Supabase
        navigate("/login", {
          state: { aviso: "Conta criada! Confirme seu e-mail para entrar." },
        });
      }
    } catch (err) {
      setErroGeral(traduzErroAuth(err.message));
    } finally {
      setEnviando(false);
    }
  }

  const campos = [
    { id: "nome", label: "Nome completo", type: "text", ph: "Seu nome" },
    { id: "email", label: "E-mail", type: "email", ph: "voce@email.com" },
    { id: "senha", label: "Senha", type: "password", ph: "Mínimo 6 caracteres" },
    { id: "confirma", label: "Confirmar senha", type: "password", ph: "Repita a senha" },
  ];

  return (
    <AuthShell titulo="Crie sua conta CuidaPet">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {campos.map((c) => (
          <div key={c.id}>
            <label className="rotulo" htmlFor={c.id}>{c.label}</label>
            <input id={c.id} type={c.type}
              className={"campo " + (erros[c.id] ? "campo-erro" : "")}
              placeholder={c.ph} value={form[c.id]}
              onChange={(e) => set(c.id, e.target.value)} />
            {erros[c.id] && <p className="mt-1 text-xs font-medium text-red-600">{erros[c.id]}</p>}
          </div>
        ))}

        {erroGeral && <p className="text-sm font-medium text-red-600">{erroGeral}</p>}

        <button type="submit" className="btn-primario w-full" disabled={enviando}>
          {enviando ? "Cadastrando..." : "CADASTRAR"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-marca-500 hover:underline">Entrar</Link>
      </p>
    </AuthShell>
  );
}
