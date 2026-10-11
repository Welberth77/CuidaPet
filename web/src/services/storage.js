import { supabase } from "../supabaseClient";

const BUCKET = "pet-fotos";

export async function uploadFotoPet(uid, file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const caminho = `${uid}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, file, { upsert: true, cacheControl: "3600" });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(caminho);
  return data.publicUrl;
}
