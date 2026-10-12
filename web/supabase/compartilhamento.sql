-- =========================================================
-- CuidaPet - Compartilhamento de pets entre usuarios
-- Rode no SQL Editor do Supabase (depois de schema.sql e storage.sql).
-- =========================================================

-- 1) Tabela de compartilhamentos (convites)
create table if not exists public.pet_shares (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets on delete cascade,
  pet_nome text,
  owner_id uuid not null references auth.users on delete cascade,
  owner_nome text,
  owner_email text,
  shared_with uuid not null references auth.users on delete cascade,
  shared_with_nome text,
  shared_with_email text,
  status text not null default 'pendente',   -- 'pendente' | 'aceito'
  created_at timestamptz default now(),
  unique (pet_id, shared_with)
);

-- 2) Funcoes de apoio (SECURITY DEFINER evita recursao de RLS)
create or replace function public.pode_acessar_pet(p_pet uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from pets where id = p_pet and owner_id = auth.uid())
      or exists (select 1 from pet_shares where pet_id = p_pet and shared_with = auth.uid() and status = 'aceito');
$$;

create or replace function public.e_dono_pet(p_pet uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from pets where id = p_pet and owner_id = auth.uid());
$$;

-- Busca de usuarios por e-mail ou nome (exclui a si mesmo)
create or replace function public.buscar_usuarios(termo text)
returns table (id uuid, nome text, email text)
language sql security definer stable set search_path = public as $$
  select p.id, p.nome, p.email
  from profiles p
  where p.id <> auth.uid()
    and length(coalesce(termo, '')) >= 2
    and (p.email ilike '%' || termo || '%' or p.nome ilike '%' || termo || '%')
  order by p.email
  limit 10;
$$;

grant execute on function public.buscar_usuarios(text) to authenticated;

-- 3) RLS da tabela de compartilhamentos
alter table public.pet_shares enable row level security;

drop policy if exists "shares_select" on public.pet_shares;
create policy "shares_select" on public.pet_shares for select
  using (owner_id = auth.uid() or shared_with = auth.uid());

drop policy if exists "shares_insert" on public.pet_shares;
create policy "shares_insert" on public.pet_shares for insert
  with check (owner_id = auth.uid() and public.e_dono_pet(pet_id) and shared_with <> auth.uid());

-- convidado aceita (atualiza o proprio convite)
drop policy if exists "shares_update" on public.pet_shares;
create policy "shares_update" on public.pet_shares for update
  using (shared_with = auth.uid()) with check (shared_with = auth.uid());

-- dono revoga OU convidado recusa/sai
drop policy if exists "shares_delete" on public.pet_shares;
create policy "shares_delete" on public.pet_shares for delete
  using (owner_id = auth.uid() or shared_with = auth.uid());

-- 4) Novas policies de PETS (dono + quem aceitou)
drop policy if exists "pets_dono" on public.pets;
drop policy if exists "pets_select" on public.pets;
drop policy if exists "pets_insert" on public.pets;
drop policy if exists "pets_update" on public.pets;
drop policy if exists "pets_delete" on public.pets;

create policy "pets_select" on public.pets for select using (public.pode_acessar_pet(id));
create policy "pets_insert" on public.pets for insert with check (owner_id = auth.uid());
create policy "pets_update" on public.pets for update using (public.pode_acessar_pet(id)) with check (public.pode_acessar_pet(id));
create policy "pets_delete" on public.pets for delete using (owner_id = auth.uid());

-- 5) SAUDE e BANHO: acesso por pet (dono ou compartilhado)
drop policy if exists "saude_dono" on public.saude;
drop policy if exists "saude_select" on public.saude;
drop policy if exists "saude_insert" on public.saude;
drop policy if exists "saude_update" on public.saude;
drop policy if exists "saude_delete" on public.saude;

create policy "saude_select" on public.saude for select using (public.pode_acessar_pet(pet_id));
create policy "saude_insert" on public.saude for insert with check (public.pode_acessar_pet(pet_id));
create policy "saude_update" on public.saude for update using (public.pode_acessar_pet(pet_id));
create policy "saude_delete" on public.saude for delete using (public.pode_acessar_pet(pet_id));

drop policy if exists "banho_dono" on public.banho_tosa;
drop policy if exists "banho_select" on public.banho_tosa;
drop policy if exists "banho_insert" on public.banho_tosa;
drop policy if exists "banho_update" on public.banho_tosa;
drop policy if exists "banho_delete" on public.banho_tosa;

create policy "banho_select" on public.banho_tosa for select using (public.pode_acessar_pet(pet_id));
create policy "banho_insert" on public.banho_tosa for insert with check (public.pode_acessar_pet(pet_id));
create policy "banho_update" on public.banho_tosa for update using (public.pode_acessar_pet(pet_id));
create policy "banho_delete" on public.banho_tosa for delete using (public.pode_acessar_pet(pet_id));
