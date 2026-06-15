-- ============================================================================
-- BLINDAJE DE SEGURIDAD (auditoría)
--
-- Hallazgos:
--   [CRÍTICO] La anon key (pública, va en el JS) podía INSERTAR filas directamente
--             en `waitlist` por la API REST, saltándose la edge function (sin
--             rate-limit, honeypot ni validación) → altas falsas / referidos manipulables.
--   [MEDIO]   Las RPC get_/project_waitlist_position eran ejecutables por anon →
--             se podía consultar la posición/existencia de cualquier email.
--
-- Solución: solo la edge function (service_role, que ignora RLS) puede tocar la tabla
-- y ejecutar las RPC. Idempotente y resiliente al orden de migraciones.
-- ============================================================================

-- 1. [CRÍTICO] RLS en waitlist + eliminar TODAS las políticas (incl. la de INSERT a anon).
alter table public.waitlist enable row level security;
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'waitlist'
  loop
    execute format('drop policy %I on public.waitlist', p.policyname);
  end loop;
end $$;
-- Sin políticas + RLS activa → anon/authenticated quedan totalmente denegados.
-- service_role tiene BYPASSRLS, así que la edge function sigue funcionando igual.

-- 2. RLS en signup_log (si la tabla ya existe).
do $$ begin
  execute 'alter table public.signup_log enable row level security';
exception when undefined_table then null;
end $$;

-- 3. [MEDIO] Restringir ejecución de las RPC: fuera public/anon/authenticated; solo service_role.
do $$ begin
  revoke execute on function public.get_waitlist_position(text) from public, anon, authenticated;
  grant execute on function public.get_waitlist_position(text) to service_role;
exception when undefined_function then null;
end $$;

do $$ begin
  revoke execute on function public.project_waitlist_position(text, integer) from public, anon, authenticated;
  grant execute on function public.project_waitlist_position(text, integer) to service_role;
exception when undefined_function then null;
end $$;

do $$ begin
  revoke execute on function public.recompute_waitlist_positions() from public, anon, authenticated;
exception when undefined_function then null;
end $$;

-- 4. Limpiar la fila de prueba creada durante la auditoría.
delete from public.waitlist where email = 'rls-test@x.com';
