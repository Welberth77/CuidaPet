-- =========================================================
-- CuidaPet - Memorial (quando o pet falece)
-- Rode no SQL Editor do Supabase.
-- =========================================================
-- Campos no pet. O proprio dono atualiza via RLS (pets_update).
alter table public.pets add column if not exists falecido boolean not null default false;
alter table public.pets add column if not exists data_falecimento date;
