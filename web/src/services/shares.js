import { supabase } from "../supabaseClient";

// Busca usuarios cadastrados por e-mail ou nome (via funcao segura no banco).
export async function buscarUsuarios(termo) {
  const { data, error } = await supabase.rpc("buscar_usuarios", { termo });
  if (error) throw error;
  return data || [];
}

// Dono envia um convite de compartilhamento.
export async function enviarConvite({ pet, dono, alvo }) {
  const { error } = await supabase.from("pet_shares").insert({
    pet_id: pet.id,
    pet_nome: pet.nome,
    owner_id: dono.uid,
    owner_nome: dono.nome,
    owner_email: dono.email,
    shared_with: alvo.id,
    shared_with_nome: alvo.nome,
    shared_with_email: alvo.email,
    status: "pendente",
  });
  if (error) throw error;
}

// Compartilhamentos de um pet (visao do dono).
export async function listarConvitesDoPet(petId) {
  const { data, error } = await supabase
    .from("pet_shares")
    .select("*")
    .eq("pet_id", petId)
    .order("created_at");
  if (error) throw error;
  return data || [];
}

// Solicitacoes recebidas pendentes (notificacoes).
export async function listarNotificacoes(uid) {
  const { data, error } = await supabase
    .from("pet_shares")
    .select("*")
    .eq("shared_with", uid)
    .eq("status", "pendente")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function aceitarConvite(id) {
  const { error } = await supabase.from("pet_shares").update({ status: "aceito" }).eq("id", id);
  if (error) throw error;
}

// Recusar (convidado) ou revogar (dono) — ambos removem o registro.
export async function removerConvite(id) {
  const { error } = await supabase.from("pet_shares").delete().eq("id", id);
  if (error) throw error;
}

// Convidado sai de um pet compartilhado com ele.
export async function sairDoCompartilhamento(petId, uid) {
  const { error } = await supabase.from("pet_shares").delete().eq("pet_id", petId).eq("shared_with", uid);
  if (error) throw error;
}
