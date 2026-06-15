-- ============================================================================
-- PRUEBA MASIVA de la waitlist SIN enviar emails ni tocar límites.
--
-- Inserta filas DIRECTAMENTE en la tabla (no pasa por la edge function), así que
-- Resend NO se usa (0 emails) y son pocas filas (nada para el plan gratuito).
-- El trigger recalcula posiciones/bloqueos automáticamente al insertar.
--
-- Requiere haber aplicado antes la migración de posiciones/bloqueo.
-- Ejecuta este bloque en Supabase → SQL Editor.
-- ============================================================================

-- 5 "influencers" (cada uno recibirá varios referidos → llegarán a 3 y se bloquearán)
insert into public.waitlist (email, referral_code, created_at)
select
  'seed_inf_' || g || '@test.local',
  'SEEDINF' || lpad(g::text, 2, '0'),
  now() - (interval '1 day' * (10 - g))     -- distintos created_at
from generate_series(1, 5) as g
on conflict (email) do nothing;

-- 30 referidos repartidos entre los 5 influencers (6 cada uno), con created_at escalonado
-- (así el 3er referido de cada influencer llega en momentos distintos → orden de bloqueo claro)
insert into public.waitlist (email, referral_code, referred_by, created_at)
select
  'seed_ref_' || g || '@test.local',
  'SEEDREF' || lpad(g::text, 3, '0'),
  'SEEDINF' || lpad((((g - 1) % 5) + 1)::text, 2, '0'),
  now() - (interval '30 min' * (40 - g))
from generate_series(1, 30) as g
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- VER RESULTADO (posición, bloqueo y nº de referidos por usuario)
-- ---------------------------------------------------------------------------
select
  w.position,
  w.locked_position,
  w.locked_at,
  w.email,
  w.referral_code,
  w.referred_by,
  ( select count(*) from public.waitlist r2
    where r2.referred_by = w.referral_code and r2.id <> w.id ) as referidos
from public.waitlist w
order by w.position nulls last;

-- ---------------------------------------------------------------------------
-- LIMPIAR todo lo de prueba (descomenta y ejecuta cuando termines):
-- delete from public.waitlist where email like 'seed\_%@test.local' escape '\';
-- ---------------------------------------------------------------------------
