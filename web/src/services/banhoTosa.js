import { supabase } from "../supabaseClient";

function paraBanco(d) {
  return {
    pet_id: d.petId || null,
    pet_nome: d.petNome || null,
    servico: d.servico || null,
    data: d.data || null,
    proxima: d.proxima || null,
    observacoes: d.observacoes || null,
  };
}

function paraTela(r) {
  return {
    id: r.id,
    petId: r.pet_id,
    petNome: r.pet_nome,
    servico: r.servico,
    data: r.data,
    proxima: r.proxima,
    observacoes: r.observacoes,
  };
}

export async function listarBanhoTosa(ownerId) {
  const { data, error } = await supabase
    .from("banho_tosa")
    .select("*")
    .order("data", { ascending: false });
  if (error) throw error;
  return (data || []).map(paraTela);
}

export async function criarBanhoTosa(ownerId, dados) {
  const { error } = await supabase.from("banho_tosa").insert({ ...paraBanco(dados), owner_id: ownerId });
  if (error) throw error;
}

export async function removerBanhoTosa(id) {
  const { error } = await supabase.from("banho_tosa").delete().eq("id", id);
  if (error) throw error;
}
