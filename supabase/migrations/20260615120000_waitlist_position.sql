-- Migration: persistent, auto-updated `position` column on the waitlist.
--
-- Ranking rule (matches existing behavior):
--   ORDER BY number_of_referrals DESC, created_at ASC
-- where a "referral" for a given row is any OTHER row whose `referred_by`
-- equals this row's `referral_code` (self-referrals excluded).
--
-- The stored `position` is recomputed in a single statement by a
-- statement-level trigger whenever signups are inserted/deleted or when the
-- referral wiring (`referred_by` / `referral_code`) changes. Because the
-- trigger fires only on those columns (not on `position`), the UPDATE it
-- performs on `position` does NOT re-fire the trigger -> no recursion.
--
-- Idempotent: safe to run more than once.

-- 1. Persistent position column ------------------------------------------------
alter table public.waitlist
  add column if not exists position integer;

-- 2. Indexes to keep the referral counting / ranking fast ----------------------
create index if not exists waitlist_referred_by_idx
  on public.waitlist (referred_by);

create index if not exists waitlist_referral_code_idx
  on public.waitlist (referral_code);

-- 3. Recompute every row's position in one statement ---------------------------
--    referral_count(r1) = number of OTHER rows r2 where
--      r2.referred_by = r1.referral_code  (and r2.id <> r1.id to exclude self)
--    rank = ROW_NUMBER() OVER (ORDER BY referral_count DESC, created_at ASC)
create or replace function public.recompute_waitlist_positions()
  returns void
  language sql
  security definer
  set search_path = public
as $$
  with counts as (
    select
      r1.id,
      r1.created_at,
      (
        select count(*)
        from public.waitlist r2
        where r2.referred_by = r1.referral_code
          and r2.id <> r1.id
      ) as referral_count
    from public.waitlist r1
  ),
  ranked as (
    select
      id,
      row_number() over (
        order by referral_count desc, created_at asc
      ) as rn
    from counts
  )
  update public.waitlist w
  set position = ranked.rn
  from ranked
  where w.id = ranked.id
    and w.position is distinct from ranked.rn;  -- skip no-op writes
$$;

-- 4. Statement-level trigger that recomputes positions on any relevant change ---
create or replace function public.trg_recompute_waitlist_positions()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  perform public.recompute_waitlist_positions();
  return null;  -- result is ignored for AFTER STATEMENT triggers
end;
$$;

-- Fire once per statement (not per row) on inserts, deletes, and changes to the
-- referral wiring. It deliberately does NOT list `position` in `UPDATE OF ...`,
-- so the position UPDATE inside recompute_waitlist_positions() will not re-fire
-- this trigger -> no infinite recursion.
drop trigger if exists waitlist_recompute_positions on public.waitlist;
create trigger waitlist_recompute_positions
  after insert or delete or update of referred_by, referral_code
  on public.waitlist
  for each statement
  execute function public.trg_recompute_waitlist_positions();

-- 5. Stored position lookup ----------------------------------------------------
-- DROP primero: CREATE OR REPLACE no permite cambiar el tipo de retorno de la
-- función previa (que podría devolver bigint). Así garantizamos la redefinición.
drop function if exists public.get_waitlist_position(text);
create or replace function public.get_waitlist_position(p_email text)
  returns integer
  language sql
  stable
  security definer
  set search_path = public
as $$
  select position
  from public.waitlist
  where email = p_email;
$$;

-- 6. Hypothetical (projected) position, computed live --------------------------
--    Effective referrals = the target's current referrals + p_extra_referrals.
--    Result = 1 + how many OTHER rows would rank ahead, i.e. rows that either
--      - have more effective referrals, or
--      - have equal effective referrals but an earlier created_at.
--    Pure read: performs no writes.
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
  v_id          uuid;
  v_created_at  timestamptz;
  v_code        text;
  v_referrals   integer;
  v_effective   integer;
  v_ahead       integer;
begin
  -- Locate the target row.
  select id, created_at, referral_code
    into v_id, v_created_at, v_code
  from public.waitlist
  where email = p_email;

  if v_id is null then
    return null;  -- unknown email
  end if;

  -- Target's current real referral count (excluding self).
  select count(*)
    into v_referrals
  from public.waitlist r2
  where r2.referred_by = v_code
    and r2.id <> v_id;

  -- Hypothetical effective referrals (never below zero).
  v_effective := greatest(v_referrals + coalesce(p_extra_referrals, 0), 0);

  -- Count every OTHER row that would still rank ahead of the target.
  -- A row r ranks ahead if it has strictly more effective referrals, or the
  -- same number of effective referrals but an earlier created_at.
  select count(*)
    into v_ahead
  from (
    select
      r1.id,
      r1.created_at,
      (
        select count(*)
        from public.waitlist r2
        where r2.referred_by = r1.referral_code
          and r2.id <> r1.id
      ) as referral_count
    from public.waitlist r1
    where r1.id <> v_id
  ) others
  where others.referral_count > v_effective
     or (others.referral_count = v_effective
         and others.created_at < v_created_at);

  return v_ahead + 1;
end;
$$;

-- 7. Backfill existing rows once -----------------------------------------------
select public.recompute_waitlist_positions();
