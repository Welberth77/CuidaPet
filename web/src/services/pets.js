import { supabase } from "../supabaseClient";

const COLUNAS = ["nome", "especie", "raca", "sexo", "peso", "nascimento", "cor", "pelagem", "sobre", "foto_url"];

function limpar(dados) {
  const out = {};
  for (const c of COLUNAS) {
    if (dados[c] !== undefined) out[c] = dados[c];
  }
  if (out.peso !== undefined && out.peso !== "" && out.peso !== null) {
    out.peso = Number(out.peso);
  }
  if (out.nascimento === "") out.nascimento = null;
  return out;
}

export async function listarPets(ownerId) {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", ownerId)
    .order("nome");
  if (error) throw error;
  return data || [];
}

export async function obterPet(id) {
  const { data, error } = await supabase.from("pets").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function criarPet(ownerId, dados) {
  const { data, error } = await supabase
    .from("pets")
    .insert({ ...limpar(dados), owner_id: ownerId })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function atualizarPet(id, dados) {
  const { error } = await supabase.from("pets").update(limpar(dados)).eq("id", id);
  if (error) throw error;
}

export async function removerPet(id) {
  const { error } = await supabase.from("pets").delete().eq("id", id);
  if (error) throw error;
}
