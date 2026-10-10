-- =========================================================
-- CuidaPet - Schema do banco (Supabase / PostgreSQL)
-- Cole este conteudo no SQL Editor do Supabase e rode (RUN).
-- =========================================================

-- ---------- PERFIS ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nome text,
  email text,
  created_at timestamptz default now()
);

-- Cria o perfil automaticamente quando um usuario se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email)
  values (new.id, new.raw_user_meta_data->>'nome', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- PETS ----------
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  nome text not null,
  especie text,
  raca text,
  sexo text,
  peso numeric,
  nascimento date,
  cor text,
  pelagem text,
  sobre text,
  created_at timestamptz default now()
);

-- ---------- SAUDE (vacinas e medicamentos) ----------
create table if not exists public.saude (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  pet_id uuid references public.pets on delete cascade,
  pet_nome text,
  categoria text,
  nome text,
  data date,
  proxima date,
  created_at timestamptz default now()
);

-- ---------- BANHO E TOSA ----------
create table if not exists public.banho_tosa (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  pet_id uuid references public.pets on delete cascade,
  pet_nome text,
  servico text,
  data date,
  proxima date,
  observacoes text,
  created_at timestamptz default now()
);

-- ---------- ROW LEVEL SECURITY ----------
alter table public.profiles   enable row level security;
alter table public.pets       enable row level security;
alter table public.saude      enable row level security;
alter table public.banho_tosa enable row level security;

-- Perfil: cada usuario le/edita apenas o proprio
create policy "perfil_proprio_select" on public.profiles for select using (auth.uid() = id);
create policy "perfil_proprio_update" on public.profiles for update using (auth.uid() = id);
create policy "perfil_proprio_insert" on public.profiles for insert with check (auth.uid() = id);

-- Pets / saude / banho: dono (owner_id) tem acesso total aos proprios registros
create policy "pets_dono" on public.pets
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "saude_dono" on public.saude
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "banho_dono" on public.banho_tosa
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
