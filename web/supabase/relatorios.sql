-- =========================================================
-- CuidaPet - Relatorios administrativos
-- Rode no SQL Editor do Supabase (depois dos outros scripts).
-- =========================================================

-- 1) Marca de administrador no perfil
alter table public.profiles add column if not exists is_admin boolean not null default false;
-- Para tornar alguem admin:
--   update public.profiles set is_admin = true where email = 'seu-email@exemplo.com';

-- 2) O chamador atual e admin?
create or replace function public.sou_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;
grant execute on function public.sou_admin() to authenticated;

-- 3) Relatorio agregado (so admin). p_incluir = false remove as contas admin da analise.
drop function if exists public.relatorio_admin();
drop function if exists public.relatorio_admin(boolean);
create or replace function public.relatorio_admin(p_incluir boolean default true)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r jsonb;
  adm uuid[];
begin
  if not public.sou_admin() then
    raise exception 'Acesso negado' using errcode = '42501';
  end if;

  select coalesce(array_agg(id), '{}') into adm from profiles where is_admin;

  select jsonb_build_object(
    'gerado_em', now(),
    'incluir_admins', p_incluir,

    'totais', jsonb_build_object(
      'usuarios',                 (select count(*) from profiles where (p_incluir or not is_admin)),
      'usuarios_confirmados',     (select count(*) from auth.users where email_confirmed_at is not null and (p_incluir or id <> all(adm))),
      'usuarios_ativos',          (select count(distinct owner_id) from pets where (p_incluir or owner_id <> all(adm))),
      'usuarios_com_avatar',      (select count(*) from profiles where coalesce(avatar_url,'') <> '' and (p_incluir or not is_admin)),
      'pets',                     (select count(*) from pets where (p_incluir or owner_id <> all(adm))),
      'pets_com_foto',            (select count(*) from pets where coalesce(foto_url,'') <> '' and (p_incluir or owner_id <> all(adm))),
      'saude',                    (select count(*) from saude where (p_incluir or owner_id <> all(adm))),
      'banho',                    (select count(*) from banho_tosa where (p_incluir or owner_id <> all(adm))),
      'despesas_qtd',             (select count(*) from despesas where (p_incluir or owner_id <> all(adm))),
      'despesas_total',           (select coalesce(sum(valor),0) from despesas where (p_incluir or owner_id <> all(adm))),
      'compartilhamentos',        (select count(*) from pet_shares where (p_incluir or owner_id <> all(adm))),
      'compartilhamentos_aceitos',(select count(*) from pet_shares where status = 'aceito' and (p_incluir or owner_id <> all(adm))),
      'novos_usuarios_7d',        (select count(*) from profiles where created_at >= now() - interval '7 days' and (p_incluir or not is_admin)),
      'novos_usuarios_30d',       (select count(*) from profiles where created_at >= now() - interval '30 days' and (p_incluir or not is_admin)),
      'novos_pets_7d',            (select count(*) from pets where created_at >= now() - interval '7 days' and (p_incluir or owner_id <> all(adm))),
      'novos_pets_30d',           (select count(*) from pets where created_at >= now() - interval '30 days' and (p_incluir or owner_id <> all(adm)))
    ),

    'usuarios_por_mes', (
      with meses as (
        select to_char(d,'YYYY-MM') as mes
        from generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month') d
      ),
      dados as (
        select to_char(date_trunc('month', created_at),'YYYY-MM') as mes, count(*) total
        from profiles where (p_incluir or not is_admin) group by 1
      )
      select coalesce(jsonb_agg(jsonb_build_object('mes', m.mes, 'total', coalesce(d.total,0)) order by m.mes), '[]'::jsonb)
      from meses m left join dados d using (mes)
    ),

    'pets_por_mes', (
      with meses as (
        select to_char(d,'YYYY-MM') as mes
        from generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month') d
      ),
      dados as (
        select to_char(date_trunc('month', created_at),'YYYY-MM') as mes, count(*) total
        from pets where (p_incluir or owner_id <> all(adm)) group by 1
      )
      select coalesce(jsonb_agg(jsonb_build_object('mes', m.mes, 'total', coalesce(d.total,0)) order by m.mes), '[]'::jsonb)
      from meses m left join dados d using (mes)
    ),

    'pets_por_especie', (
      select coalesce(jsonb_agg(jsonb_build_object('rotulo', k, 'valor', v) order by v desc), '[]'::jsonb)
      from (select coalesce(nullif(trim(especie),''),'(nao informado)') k, count(*) v from pets where (p_incluir or owner_id <> all(adm)) group by 1) t
    ),
    'pets_por_sexo', (
      select coalesce(jsonb_agg(jsonb_build_object('rotulo', k, 'valor', v) order by v desc), '[]'::jsonb)
      from (select coalesce(nullif(trim(sexo),''),'(nao informado)') k, count(*) v from pets where (p_incluir or owner_id <> all(adm)) group by 1) t
    ),
    'top_racas', (
      select coalesce(jsonb_agg(jsonb_build_object('rotulo', k, 'valor', v) order by v desc), '[]'::jsonb)
      from (select coalesce(nullif(trim(raca),''),'(nao informado)') k, count(*) v from pets where (p_incluir or owner_id <> all(adm)) group by 1 order by v desc limit 8) t
    ),
    'saude_por_categoria', (
      select coalesce(jsonb_agg(jsonb_build_object('rotulo', k, 'valor', v) order by v desc), '[]'::jsonb)
      from (select coalesce(nullif(trim(categoria),''),'(nao informado)') k, count(*) v from saude where (p_incluir or owner_id <> all(adm)) group by 1) t
    ),
    'banho_por_servico', (
      select coalesce(jsonb_agg(jsonb_build_object('rotulo', k, 'valor', v) order by v desc), '[]'::jsonb)
      from (select coalesce(nullif(trim(servico),''),'(nao informado)') k, count(*) v from banho_tosa where (p_incluir or owner_id <> all(adm)) group by 1) t
    ),
    'despesas_por_categoria', (
      select coalesce(jsonb_agg(jsonb_build_object('rotulo', k, 'valor', v) order by v desc), '[]'::jsonb)
      from (select coalesce(nullif(trim(categoria),''),'(nao informado)') k, round(sum(valor),2) v from despesas where (p_incluir or owner_id <> all(adm)) group by 1) t
    ),
    'pets_por_usuario', (
      select coalesce(jsonb_agg(jsonb_build_object('rotulo', faixa, 'valor', v) order by ordem), '[]'::jsonb)
      from (
        select faixa, ordem, count(*) v from (
          select case when n = 1 then '1 pet' when n = 2 then '2 pets' when n = 3 then '3 pets' else '4+ pets' end faixa,
                 case when n = 1 then 1 when n = 2 then 2 when n = 3 then 3 else 4 end ordem
          from (select owner_id, count(*) n from pets where (p_incluir or owner_id <> all(adm)) group by owner_id) p
        ) g group by faixa, ordem
      ) x
    )
  ) into r;

  return r;
end;
$$;
grant execute on function public.relatorio_admin(boolean) to authenticated;

-- =========================================================
-- 4) Listas detalhadas (so admin)
-- =========================================================
create or replace function public.listar_usuarios_admin()
returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb;
begin
  if not public.sou_admin() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'nome', p.nome, 'email', coalesce(p.email, u.email),
    'is_admin', p.is_admin, 'confirmado', (u.email_confirmed_at is not null),
    'criado_em', p.created_at, 'ultimo_acesso', u.last_sign_in_at,
    'pets', (select count(*) from pets where owner_id = p.id)
  ) order by p.created_at desc), '[]'::jsonb)
  into r from profiles p left join auth.users u on u.id = p.id;
  return r;
end;
$$;
grant execute on function public.listar_usuarios_admin() to authenticated;

create or replace function public.listar_pets_admin()
returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb;
begin
  if not public.sou_admin() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pt.id, 'nome', pt.nome, 'especie', pt.especie, 'raca', pt.raca,
    'sexo', pt.sexo, 'foto_url', pt.foto_url, 'criado_em', pt.created_at,
    'tutor_nome', pr.nome, 'tutor_email', coalesce(pr.email, u.email)
  ) order by pt.created_at desc), '[]'::jsonb)
  into r from pets pt
  left join profiles pr on pr.id = pt.owner_id
  left join auth.users u on u.id = pt.owner_id;
  return r;
end;
$$;
grant execute on function public.listar_pets_admin() to authenticated;
