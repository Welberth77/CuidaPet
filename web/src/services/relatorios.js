import { supabase } from "../supabaseClient";

// Relatorio agregado (so admin; a funcao no banco garante a permissao).
export async function obterRelatorio(incluirAdmins = true) {
  const { data, error } = await supabase.rpc("relatorio_admin", { p_incluir: incluirAdmins });
  if (error) throw error;
  return data;
}

// Lista de usuarios cadastrados (com ultimo acesso).
export async function listarUsuariosAdmin() {
  const { data, error } = await supabase.rpc("listar_usuarios_admin");
  if (error) throw error;
  return data || [];
}

// Lista de pets cadastrados (com o tutor).
export async function listarPetsAdmin() {
  const { data, error } = await supabase.rpc("listar_pets_admin");
  if (error) throw error;
  return data || [];
}
