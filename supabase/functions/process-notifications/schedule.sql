-- Habilitar as extensões necessárias
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Agendar a execução da função a cada hora
select
  cron.schedule(
    'process-notifications-hourly',
    '0 * * * *',
    $$
    select
      net.http_post(
        url:='https://pikxpmhpcsrstmikkpvg.supabase.co/functions/v1/process-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
      ) as request_id;
    $$
  );