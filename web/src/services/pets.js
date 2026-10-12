import { supabase } from "../supabaseClient";

const COLUNAS = ["nome", "especie", "raca", "sexo", "peso", "nascimento", "cor", "pelagem", "sobre", "foto_url"];

function limpar(dados) {
  const out = {};
  for (const c of COLUNAS) {
    if (dados[c] !== undefined) out[c] = dados[c];
  }
  // peso vazio vira null (coluna numerica nao aceita string vazia)
  if (out.peso === "" || out.peso === undefined || out.peso === null) {
    out.peso = null;
  } else {
    out.peso = Number(out.peso);
  }
  if (out.nascimento === "") out.nascimento = null;
  // Se nao houver foto, nao envia o campo (assim o cadastro funciona mesmo
  // antes de rodar o storage.sql que cria a coluna foto_url).
  if (out.foto_url === "" || out.foto_url === undefined || out.foto_url === null) {
    delete out.foto_url;
  }
  return out;
}

export async function listarPets(ownerId) {
  // Sem filtro de owner: o RLS retorna os pets do dono + os compartilhados aceitos.
  const { data, error } = await supabase
    .from("pets")
    .select("*")
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
  // Garante uma sessao VALIDA agora. getSession() renova o token se estiver
  // expirado; sem isso o insert pode ir com um JWT vencido e o auth.uid() do
  // Postgres vira NULL -> viola o RLS mesmo com owner_id correto.
  const { data: s } = await supabase.auth.getSession();
  let session = s?.session || null;
  if (!session) {
    // tenta uma renovacao explicita antes de desistir
    const { data: r } = await supabase.auth.refreshSession();
    session = r?.session || null;
  }
  if (!session?.user?.id) {
    throw new Error("Sua sessao expirou. Saia e entre novamente para cadastrar o pet.");
  }
  const oid = session.user.id;
  const { data, error } = await supabase
    .from("pets")
    .insert({ ...limpar(dados), owner_id: oid })
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
