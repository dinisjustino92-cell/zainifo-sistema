-- Execute este script no Supabase: seu projeto → SQL Editor → New query → colar e "Run".

create table if not exists kv_store (
  key text primary key,
  value jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table kv_store enable row level security;

-- Acesso público de leitura e escrita (chave "anon"), pensado para uso
-- interno de uma pequena equipe. Não armazene dados sensíveis além do
-- necessário para o funcionamento do sistema.
create policy "permitir leitura publica" on kv_store
  for select using (true);

create policy "permitir escrita publica" on kv_store
  for insert with check (true);

create policy "permitir atualizacao publica" on kv_store
  for update using (true);
