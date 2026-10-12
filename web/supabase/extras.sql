-- =========================================================
-- CuidaPet - Extras: avatar do usuario, despesas e realtime
-- Rode no SQL Editor do Supabase (depois dos outros scripts).
-- =========================================================

-- 1) Foto de perfil do usuario
alter table public.profiles add column if not exists avatar_url text;

-- 2) Controle de despesas por pet
create table if not exists public.despesas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  pet_id uuid references public.pets on delete cascade,
  pet_nome text,
  categoria text,
  descricao text,
  valor numeric not null default 0,
  data date,
  created_at timestamptz default now()
);

alter table public.despesas enable row level security;

drop policy if exists "despesas_select" on public.despesas;
drop policy if exists "despesas_insert" on public.despesas;
drop policy if exists "despesas_update" on public.despesas;
drop policy if exists "despesas_delete" on public.despesas;

-- Acesso por pet (dono ou compartilhado), igual saude/banho
create policy "despesas_select" on public.despesas for select using (public.pode_acessar_pet(pet_id));
create policy "despesas_insert" on public.despesas for insert with check (public.pode_acessar_pet(pet_id));
create policy "despesas_update" on public.despesas for update using (public.pode_acessar_pet(pet_id));
create policy "despesas_delete" on public.despesas for delete using (public.pode_acessar_pet(pet_id));

-- 3) Realtime para as notificacoes (pet_shares)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pet_shares'
  ) then
    alter publication supabase_realtime add table public.pet_shares;
  end if;
end $$;
