-- =========================================================
-- CuidaPet - Foto do pet (Supabase Storage)
-- Rode no SQL Editor do Supabase (depois do schema.sql).
-- =========================================================

-- 1) Coluna da foto na tabela de pets
alter table public.pets add column if not exists foto_url text;

-- 2) Bucket publico para as fotos dos pets
insert into storage.buckets (id, name, public)
values ('pet-fotos', 'pet-fotos', true)
on conflict (id) do nothing;

-- 3) Politicas de acesso ao bucket
-- Leitura publica (as fotos aparecem no app via URL publica)
create policy "pet_fotos_leitura_publica"
  on storage.objects for select
  using (bucket_id = 'pet-fotos');

-- Cada usuario so envia/edita/remove dentro da sua propria pasta (uid/)
create policy "pet_fotos_insert_proprio"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'pet-fotos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "pet_fotos_update_proprio"
  on storage.objects for update to authenticated
  using (bucket_id = 'pet-fotos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "pet_fotos_delete_proprio"
  on storage.objects for delete to authenticated
  using (bucket_id = 'pet-fotos' and (storage.foldername(name))[1] = auth.uid()::text);
