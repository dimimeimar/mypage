-- Runs gcal-sync every 5 minutes as a safety net.
-- Replace PUT_SYNC_SECRET_HERE with the same value you set as the SYNC_SECRET function secret.
-- Do NOT commit the edited file.
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'gcal-sync-5min',
  '*/5 * * * *',
  $$
  select net.http_post(
    url     := 'https://zmcoilcrhzhxnancbitm.supabase.co/functions/v1/gcal-sync',
    headers := jsonb_build_object('Content-Type','application/json','x-sync-secret','PUT_SYNC_SECRET_HERE'),
    body    := '{}'::jsonb
  );
  $$
);
-- To stop it: select cron.unschedule('gcal-sync-5min');
