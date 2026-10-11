import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { traduzErroAuth } from "../utils/errosAuth.js";
import AuthShell from "../components/AuthShell.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useToast } from "../components/ui/Toast.jsx";

export default function RedefinirSenha() {
  const { definirNovaSenha } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (senha.length < 6) {
      setErro("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }
    if (senha !== confirma) {
      setErro("As senhas não são iguais.");
      return;
    }
    setEnviando(true);
    try {
      await definirNovaSenha(senha);
      toast.sucesso("Senha redefinida com sucesso!");
      navigate("/");
    } catch (err) {
      setErro(traduzErroAuth(err.message));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell titulo="Definir nova senha" subtitulo="Escolha uma nova senha para sua conta.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="rotulo" htmlFor="senha">Nova senha</label>
          <PasswordInput id="senha" value={senha} placeholder="Mínimo 6 caracteres"
            autoComplete="new-password" onChange={(e) => setSenha(e.target.value)} />
        </div>
        <div>
          <label className="rotulo" htmlFor="confirma">Confirmar nova senha</label>
          <PasswordInput id="confirma" value={confirma} placeholder="Repita a senha"
            autoComplete="new-password" onChange={(e) => setConfirma(e.target.value)} />
        </div>
        {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}
        <button type="submit" className="btn-primario w-full" disabled={enviando}>
          {enviando ? <><Spinner size={18} className="mr-2 border-white/40 border-t-white" /> Salvando...</> : "Salvar nova senha"}
        </button>
      </form>
    </AuthShell>
  );
}
