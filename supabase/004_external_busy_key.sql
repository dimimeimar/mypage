-- Fix for databases that already ran the first version of 002:
-- recurring Google events share one id, so the key must include the start time.
alter table public.external_busy drop constraint if exists external_busy_pkey;
alter table public.external_busy add primary key (google_event_id, starts_at);
