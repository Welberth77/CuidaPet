import { supabase } from "../supabaseClient";

// Retorna o relatorio agregado (so admin; o RLS/funcao garante a permissao).
export async function obterRelatorio() {
  const { data, error } = await supabase.rpc("relatorio_admin");
  if (error) throw error;
  return data;
}
