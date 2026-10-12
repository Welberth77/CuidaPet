import { supabase } from "../supabaseClient";

function paraBanco(d) {
  return {
    pet_id: d.petId || null,
    pet_nome: d.petNome || null,
    categoria: d.categoria || null,
    descricao: d.descricao || null,
    valor: Number(d.valor) || 0,
    data: d.data || null,
  };
}

function paraTela(r) {
  return {
    id: r.id,
    petId: r.pet_id,
    petNome: r.pet_nome,
    categoria: r.categoria,
    descricao: r.descricao,
    valor: r.valor,
    data: r.data,
  };
}

export async function listarDespesas() {
  const { data, error } = await supabase
    .from("despesas")
    .select("*")
    .order("data", { ascending: false });
  if (error) throw error;
  return (data || []).map(paraTela);
}

export async function criarDespesa(ownerId, dados) {
  const { error } = await supabase.from("despesas").insert({ ...paraBanco(dados), owner_id: ownerId });
  if (error) throw error;
}

export async function atualizarDespesa(id, dados) {
  const { error } = await supabase.from("despesas").update(paraBanco(dados)).eq("id", id);
  if (error) throw error;
}

export async function removerDespesa(id) {
  const { error } = await supabase.from("despesas").delete().eq("id", id);
  if (error) throw error;
}
