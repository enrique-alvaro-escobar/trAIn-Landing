-- Migration: POSICIONES BLOQUEADAS (locked) por referidos.  (autocontenida)
--
-- Regla de negocio:
--   * Cuando un usuario alcanza 3 referidos con su código, su posición queda
--     BLOQUEADA de forma PERMANENTE.
--   * El primero en llegar a 3 referidos bloquea la posición #1, el siguiente
--     la #2, etc. — por orden de CUÁNDO alcanzaron su 3er referido.
--   * Se bloquean hasta 100 (Wave 1). A partir de ahí no se bloquean más.
--   * Los NO bloqueados se ordenan por debajo del bloque bloqueado, por
--     (nº de referidos desc, created_at asc).
--
-- Idempotente: seguro re-ejecutar. Reemplaza/define toda la lógica de posición,
-- así que funciona se haya aplicado o no la migración anterior.

-- 1. Columnas -----------------------------------------------------------------
alter table public.waitlist add column if not exists position integer;
alter table public.waitlist add column if not exists locked_position integer;
alter table public.waitlist add column if not exists locked_at timestamptz;

-- Una posición bloqueada es única; índices para el conteo de referidos.
create unique index if not exists waitlist_locked_position_uidx
  on public.waitlist (locked_position) where locked_position is not null;
create index if not exists waitlist_referred_by_idx on public.waitlist (referred_by);
create index if not exists waitlist_referral_code_idx on public.waitlist (referral_code);

-- 2. Recompute: bloqueo de nuevos elegibles + recálculo de posiciones ---------
create or replace function public.recompute_waitlist_positions()
  returns void
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  v_max_locked integer;
begin
  -- A) Bloquear nuevos elegibles (>=3 referidos y aún sin bloquear), por orden
  --    de cuándo alcanzaron su 3er referido (created_at del 3er referido),
  --    asignando posiciones consecutivas hasta 100.
  select coalesce(max(locked_position), 0) into v_max_locked from public.waitlist;

  if v_max_locked < 100 then
    with elig as (
      select
        w.id,
        (select count(*) from public.waitlist r2
           where r2.referred_by = w.referral_code and r2.id <> w.id) as rc,
        (select r3.created_at from public.waitlist r3
           where r3.referred_by = w.referral_code and r3.id <> w.id
           order by r3.created_at asc offset 2 limit 1) as third_at
      from public.waitlist w
      where w.locked_position is null
    ),
    to_lock as (
      select id,
             v_max_locked + row_number() over (order by third_at asc) as new_pos
      from elig
      where rc >= 3 and third_at is not null
    )
    update public.waitlist w
    set locked_position = tl.new_pos,
        locked_at = now()
    from to_lock tl
    where w.id = tl.id
      and tl.new_pos <= 100;
  end if;

  -- B) Recalcular `position`: los bloqueados conservan su locked_position;
  --    el resto se ordena por debajo del bloque bloqueado.
  with n_locked as (
    select count(*) as c from public.waitlist where locked_position is not null
  ),
  unlocked as (
    select w.id, w.created_at,
      (select count(*) from public.waitlist r2
         where r2.referred_by = w.referral_code and r2.id <> w.id) as rc
    from public.waitlist w
    where w.locked_position is null
  ),
  ranked as (
    select id,
      (select c from n_locked) + row_number() over (order by rc desc, created_at asc) as pos
    from unlocked
  ),
  final as (
    select id, locked_position as pos from public.waitlist where locked_position is not null
    union all
    select id, pos from ranked
  )
  update public.waitlist w
  set position = f.pos
  from final f
  where w.id = f.id
    and w.position is distinct from f.pos;
end;
$$;

-- 3. Trigger (statement-level; no recurre porque solo fija `position`/locked) ---
create or replace function public.trg_recompute_waitlist_positions()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  perform public.recompute_waitlist_positions();
  return null;
end;
$$;

drop trigger if exists waitlist_recompute_positions on public.waitlist;
create trigger waitlist_recompute_positions
  after insert or delete or update of referred_by, referral_code
  on public.waitlist
  for each statement
  execute function public.trg_recompute_waitlist_positions();

-- 4. Lookup de posición (devuelve la almacenada) ------------------------------
drop function if exists public.get_waitlist_position(text);
create or replace function public.get_waitlist_position(p_email text)
  returns integer
  language sql
  stable
  security definer
  set search_path = public
as $$
  select position from public.waitlist where email = p_email;
$$;

-- 5. Proyección con N referidos más (consciente del bloqueo) ------------------
drop function if exists public.project_waitlist_position(text, integer);
create or replace function public.project_waitlist_position(
  p_email text,
  p_extra_referrals integer
)
  returns integer
  language plpgsql
  stable
  security definer
  set search_path = public
as $$
declare
  v_id uuid; v_created timestamptz; v_code text; v_locked integer;
  v_rc integer; v_eff integer; v_nlocked integer; v_ahead integer;
begin
  select id, created_at, referral_code, locked_position
    into v_id, v_created, v_code, v_locked
  from public.waitlist where email = p_email;
  if v_id is null then return null; end if;

  -- Ya bloqueado: su posición es fija.
  if v_locked is not null then return v_locked; end if;

  select count(*) into v_rc from public.waitlist r2
    where r2.referred_by = v_code and r2.id <> v_id;
  v_eff := greatest(v_rc + coalesce(p_extra_referrals, 0), 0);

  select count(*) into v_nlocked from public.waitlist where locked_position is not null;

  -- Con esos referidos llegaría a 3 y aún quedan plazas de bloqueo → bloquearía
  -- la siguiente posición libre del bloque.
  if v_eff >= 3 and v_nlocked < 100 then
    return v_nlocked + 1;
  end if;

  -- Si no, ranking por debajo del bloque bloqueado, entre los no bloqueados.
  select count(*) into v_ahead
  from (
    select r1.id, r1.created_at,
      (select count(*) from public.waitlist r2
         where r2.referred_by = r1.referral_code and r2.id <> r1.id) as rc
    from public.waitlist r1
    where r1.id <> v_id and r1.locked_position is null
  ) o
  where o.rc > v_eff or (o.rc = v_eff and o.created_at < v_created);

  return v_nlocked + v_ahead + 1;
end;
$$;

-- 6. Backfill (bloquea históricos con >=3 y recalcula todo) -------------------
select public.recompute_waitlist_positions();
