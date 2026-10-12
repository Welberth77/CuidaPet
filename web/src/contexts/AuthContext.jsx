import { createContext, useContext, useEffect, useState } from "react";
import { supabase, supabaseConfigValido } from "../supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  async function carregarPerfil(user) {
    if (!user) {
      setPerfil(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("nome, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    setPerfil(data || { nome: user.user_metadata?.nome || "", email: user.email });
  }

  function normalizar(session) {
    const u = session?.user;
    return u ? { uid: u.id, email: u.email, displayName: u.user_metadata?.nome } : null;
  }

  useEffect(() => {
    if (!supabaseConfigValido) {
      setCarregando(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setUsuario(normalizar(data.session));
      await carregarPerfil(data.session?.user);
      setCarregando(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evento, session) => {
      setUsuario(normalizar(session));
      await carregarPerfil(session?.user);
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cadastrar(nome, email, senha) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome },
        emailRedirectTo: window.location.origin + "/confirmado",
      },
    });
    if (error) throw error;
    return data; // data.session pode ser null se a confirmacao por e-mail estiver ativa
  }

  async function entrar(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
    return data;
  }

  async function sair() {
    await supabase.auth.signOut();
  }

  async function excluirConta() {
    const { error } = await supabase.rpc("excluir_minha_conta");
    if (error) throw error;
    await supabase.auth.signOut();
  }

  // Confirmacao de cadastro por codigo (OTP) enviado por e-mail
  async function confirmarCodigo(email, codigo) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: codigo,
      type: "signup",
    });
    if (error) throw error;
    return data;
  }

  async function reenviarCodigo(email) {
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) throw error;
  }

  async function resetarSenha(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/redefinir-senha",
    });
    if (error) throw error;
  }

  async function definirNovaSenha(novaSenha) {
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) throw error;
  }

  async function atualizarPerfil(dados) {
    if (!usuario) return;
    await supabase.from("profiles").update(dados).eq("id", usuario.uid);
    if (dados.nome) {
      await supabase.auth.updateUser({ data: { nome: dados.nome } });
    }
    setPerfil((p) => ({ ...p, ...dados }));
  }

  const valor = { usuario, perfil, carregando, cadastrar, entrar, sair, atualizarPerfil, resetarSenha, definirNovaSenha, confirmarCodigo, reenviarCodigo, excluirConta };
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
