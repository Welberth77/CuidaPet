-- =========================================================
-- CuidaPet - Exclusao da propria conta pelo usuario
-- Rode no SQL Editor do Supabase (depois dos outros scripts).
-- =========================================================

create or replace function public.excluir_minha_conta()
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Nao autenticado';
  end if;

  -- Remove as fotos do usuario no Storage (os demais dados caem em cascata)
  delete from storage.objects
   where bucket_id = 'pet-fotos'
     and (storage.foldername(name))[1] = uid::text;

  -- Apaga o usuario; profiles, pets, saude, banho_tosa e pet_shares
  -- tem ON DELETE CASCADE referenciando auth.users, entao somem junto.
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.excluir_minha_conta() from public, anon;
grant execute on function public.excluir_minha_conta() to authenticated;
