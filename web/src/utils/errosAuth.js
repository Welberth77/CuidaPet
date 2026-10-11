// Traduz mensagens de erro do Supabase Auth para portugues.
export function traduzErroAuth(mensagem = "") {
  const m = mensagem.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials"))
    return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed"))
    return "Confirme seu e-mail antes de entrar.";
  if (m.includes("token has expired") || m.includes("invalid") && m.includes("token") || m.includes("otp"))
    return "Código inválido ou expirado. Peça um novo.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Este e-mail já está cadastrado.";
  if (m.includes("password should be at least"))
    return "A senha deve ter no mínimo 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "E-mail inválido.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas. Tente novamente mais tarde.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Falha de conexão. Verifique sua internet e a configuração do Supabase.";
  return "Ocorreu um erro. Tente novamente.";
}
