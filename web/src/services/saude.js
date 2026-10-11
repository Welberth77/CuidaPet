import { supabase } from "../supabaseClient";

// Converte do formato da tela (petId/petNome) para colunas do banco.
function paraBanco(d) {
  return {
    pet_id: d.petId || null,
    pet_nome: d.petNome || null,
    categoria: d.categoria || null,
    nome: d.nome || null,
    data: d.data || null,
    proxima: d.proxima || null,
  };
}

function paraTela(r) {
  return {
    id: r.id,
    petId: r.pet_id,
    petNome: r.pet_nome,
    categoria: r.categoria,
    nome: r.nome,
    data: r.data,
    proxima: r.proxima,
  };
}

export async function listarSaude(ownerId) {
  const { data, error } = await supabase
    .from("saude")
    .select("*")
    .order("data", { ascending: false });
  if (error) throw error;
  return (data || []).map(paraTela);
}

export async function criarSaude(ownerId, dados) {
  const { error } = await supabase.from("saude").insert({ ...paraBanco(dados), owner_id: ownerId });
  if (error) throw error;
}

export async function removerSaude(id) {
  const { error } = await supabase.from("saude").delete().eq("id", id);
  if (error) throw error;
}
