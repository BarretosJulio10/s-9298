-- Criar um agendamento para executar a função a cada hora
select
  cron.schedule(
    'process-notifications', -- nome do agendamento
    '0 * * * *', -- executar a cada hora (minuto 0)
    $$
    select
      net.http_post(
        url:='{{SUPABASE_URL}}/functions/v1/process-notifications',
        headers:='{
          "Content-Type": "application/json",
          "Authorization": "Bearer {{SUPABASE_SERVICE_ROLE_KEY}}"
        }'::jsonb
      ) as request_id;
    $$
  );