-- Tabla de log para rate limiting por IP de la edge function join-waitlist.
-- La función registra cada intento (ip + timestamp) y rechaza si hay >=10 en 1 hora
-- desde la misma IP. Idempotente.

create table if not exists public.signup_log (
  id         bigint generated always as identity primary key,
  ip         text,
  created_at timestamptz not null default now()
);

create index if not exists signup_log_ip_created_idx
  on public.signup_log (ip, created_at);

-- RLS activado SIN políticas: anon/authenticated quedan denegados (no se expone por la
-- API REST). La edge function usa la service role, que ignora RLS.
alter table public.signup_log enable row level security;

-- (Opcional) limpieza manual de entradas antiguas:
-- delete from public.signup_log where created_at < now() - interval '7 days';
