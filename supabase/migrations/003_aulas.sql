-- ================================================================
-- FocoENEM — Tabela de conteúdo (aulas/slides)
-- Execute no Supabase SQL Editor
-- ================================================================

create table public.aulas (
  id          uuid primary key default uuid_generate_v4(),
  area        text not null,
  topico      text not null,
  subtopico   text not null,
  ordem       integer not null default 0,
  titulo      text not null,
  slides      jsonb not null default '[]',
  -- Cada slide:
  -- {
  --   tipo: 'capa' | 'conteudo' | 'formula' | 'exemplo' | 'video' | 'exercicio' | 'resumo'
  --   titulo: string
  --   corpo: string (HTML simples)
  --   formula: string (LaTeX ou texto)
  --   video_url: string (YouTube embed)
  --   exercicio: { enunciado, alternativas:[{letra,texto}], resposta, explicacao }
  --   dica: string
  -- }
  duracao_estimada_min integer default 20,
  ativo       boolean default true,
  created_at  timestamptz default now()
);

alter table public.aulas enable row level security;

create policy "aulas_select" on public.aulas for select
  using (auth.uid() is not null and ativo = true);

alter publication supabase_realtime add table public.aulas;
