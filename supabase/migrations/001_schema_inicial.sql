-- ================================================================
-- FocoENEM — Migration completa do banco de dados
-- Execute no Supabase SQL Editor ou via: supabase db push
-- ================================================================

-- ── EXTENSÕES ────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── TABELA: users ────────────────────────────────────────────────
create table public.users (
  id                    uuid primary key references auth.users(id) on delete cascade,
  email                 text not null unique,
  nome                  text not null,
  sobrenome             text not null,
  whatsapp              text not null,
  role                  text not null check (role in ('aluno', 'responsavel')),

  -- campos do aluno
  data_enem             date,
  meta_nota             integer,
  curso_desejado        text,
  areas_fracas          text[] default '{}',
  responsavel_id        uuid references public.users(id),

  -- campos do responsável
  aluno_id              uuid references public.users(id),
  meta_horas_dia        integer default 3,
  minimo_acerto         integer default 60,
  horario_resumo        text default '20:00',
  plano_ativo           boolean default false,
  stripe_customer_id    text,
  stripe_subscription_id text,

  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ── TABELA: sessoes ──────────────────────────────────────────────
create table public.sessoes (
  id                uuid primary key default uuid_generate_v4(),
  aluno_id          uuid not null references public.users(id) on delete cascade,
  area              text not null,
  topico            text not null,
  inicio            timestamptz not null default now(),
  fim               timestamptz,
  duracao_segundos  integer default 0,
  status            text not null default 'em_andamento'
                    check (status in ('em_andamento','pausada','finalizada','valida','invalida')),
  pausas            jsonb default '[]',
  alertas           jsonb default '[]',
  created_at        timestamptz default now()
);

-- ── TABELA: alertas_sessao ───────────────────────────────────────
create table public.alertas_sessao (
  id          uuid primary key default uuid_generate_v4(),
  sessao_id   uuid not null references public.sessoes(id) on delete cascade,
  aluno_id    uuid not null references public.users(id) on delete cascade,
  tipo        text not null check (tipo in ('inatividade','saiu_app','troca_tela','tela_parada')),
  detalhes    text,
  timestamp   timestamptz not null default now()
);

-- ── TABELA: questoes ─────────────────────────────────────────────
create table public.questoes (
  id               uuid primary key default uuid_generate_v4(),
  area             text not null,
  topico           text not null,
  subtopico        text,
  ano_enem         integer,
  enunciado        text not null,
  alternativas     jsonb not null,   -- [{letra, texto}]
  resposta_correta text not null,
  dificuldade      text not null check (dificuldade in ('facil','medio','dificil')),
  explicacao       text,
  ativo            boolean default true,
  created_at       timestamptz default now()
);

-- ── TABELA: mini_provas ──────────────────────────────────────────
create table public.mini_provas (
  id                    uuid primary key default uuid_generate_v4(),
  sessao_id             uuid not null references public.sessoes(id) on delete cascade,
  aluno_id              uuid not null references public.users(id) on delete cascade,
  respostas             jsonb not null default '[]',
  -- cada resposta: { questao_id, resposta_escolhida, resultado, tempo_segundos, topico }
  total_questoes        integer not null,
  total_corretas        integer not null default 0,
  percentual_acerto     integer not null default 0,
  tempo_total_segundos  integer not null default 0,
  valida                boolean not null default false,
  created_at            timestamptz default now()
);

-- ── TABELA: progresso_geral ──────────────────────────────────────
create table public.progresso_geral (
  id                        uuid primary key default uuid_generate_v4(),
  aluno_id                  uuid not null unique references public.users(id) on delete cascade,
  streak_atual              integer default 0,
  streak_maximo             integer default 0,
  total_horas_estudadas     numeric(8,2) default 0,
  total_sessoes_validas     integer default 0,
  total_sessoes_invalidas   integer default 0,
  acerto_geral              integer default 0,
  ultima_atualizacao        timestamptz default now()
);

-- ── TABELA: progresso_areas ──────────────────────────────────────
create table public.progresso_areas (
  id                        uuid primary key default uuid_generate_v4(),
  aluno_id                  uuid not null references public.users(id) on delete cascade,
  area                      text not null,
  total_questoes            integer default 0,
  total_corretas            integer default 0,
  percentual                integer default 0,
  tempo_total_segundos      integer default 0,
  tempo_medio_por_questao   integer default 0,
  topicos_fortes            text[] default '{}',
  topicos_fracos            text[] default '{}',
  updated_at                timestamptz default now(),
  unique(aluno_id, area)
);

-- ── TABELA: assinaturas ──────────────────────────────────────────
create table public.assinaturas (
  id                       uuid primary key default uuid_generate_v4(),
  responsavel_id           uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id   text not null unique,
  stripe_customer_id       text not null,
  status                   text not null default 'active'
                           check (status in ('active','canceled','past_due','trialing')),
  proximo_pagamento        timestamptz,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

-- ════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só vê os próprios dados
-- ════════════════════════════════════════════════════════════════

alter table public.users             enable row level security;
alter table public.sessoes           enable row level security;
alter table public.alertas_sessao    enable row level security;
alter table public.questoes          enable row level security;
alter table public.mini_provas       enable row level security;
alter table public.progresso_geral   enable row level security;
alter table public.progresso_areas   enable row level security;
alter table public.assinaturas       enable row level security;

-- users: cada um vê o próprio perfil
-- responsável também vê o perfil do seu aluno
create policy "users_select" on public.users for select
  using (
    auth.uid() = id
    or auth.uid() = responsavel_id
    or auth.uid() = aluno_id
  );

create policy "users_update" on public.users for update
  using (auth.uid() = id);

-- sessoes: aluno vê as próprias; responsável vê as do seu aluno
create policy "sessoes_select" on public.sessoes for select
  using (
    auth.uid() = aluno_id
    or exists (
      select 1 from public.users
      where id = auth.uid() and aluno_id = sessoes.aluno_id
    )
  );

create policy "sessoes_insert" on public.sessoes for insert
  with check (auth.uid() = aluno_id);

create policy "sessoes_update" on public.sessoes for update
  using (auth.uid() = aluno_id);

-- alertas: mesma regra das sessoes
create policy "alertas_select" on public.alertas_sessao for select
  using (
    auth.uid() = aluno_id
    or exists (
      select 1 from public.users
      where id = auth.uid() and aluno_id = alertas_sessao.aluno_id
    )
  );

create policy "alertas_insert" on public.alertas_sessao for insert
  with check (auth.uid() = aluno_id);

-- questoes: todos os usuários autenticados podem ler
create policy "questoes_select" on public.questoes for select
  using (auth.uid() is not null and ativo = true);

-- mini_provas
create policy "mini_provas_select" on public.mini_provas for select
  using (
    auth.uid() = aluno_id
    or exists (
      select 1 from public.users
      where id = auth.uid() and aluno_id = mini_provas.aluno_id
    )
  );

create policy "mini_provas_insert" on public.mini_provas for insert
  with check (auth.uid() = aluno_id);

-- progresso
create policy "progresso_geral_select" on public.progresso_geral for select
  using (
    auth.uid() = aluno_id
    or exists (
      select 1 from public.users
      where id = auth.uid() and aluno_id = progresso_geral.aluno_id
    )
  );

create policy "progresso_areas_select" on public.progresso_areas for select
  using (
    auth.uid() = aluno_id
    or exists (
      select 1 from public.users
      where id = auth.uid() and aluno_id = progresso_areas.aluno_id
    )
  );

-- assinaturas: só o responsável vê a própria
create policy "assinaturas_select" on public.assinaturas for select
  using (auth.uid() = responsavel_id);

-- ════════════════════════════════════════════════════════════════
-- FUNÇÕES E TRIGGERS
-- ════════════════════════════════════════════════════════════════

-- Trigger: criar perfil automaticamente após signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, nome, sobrenome, whatsapp, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'sobrenome', ''),
    coalesce(new.raw_user_meta_data->>'whatsapp', ''),
    coalesce(new.raw_user_meta_data->>'role', 'aluno')
  );

  -- Criar registro de progresso se for aluno
  if (new.raw_user_meta_data->>'role') = 'aluno' then
    insert into public.progresso_geral (aluno_id) values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Função: atualizar progresso após mini-prova finalizada
create or replace function public.atualizar_progresso_apos_prova()
returns trigger language plpgsql security definer as $$
declare
  v_area text;
  v_minimo_acerto integer;
  v_sessao_valida boolean;
begin
  -- Buscar área da sessão
  select area into v_area from public.sessoes where id = new.sessao_id;

  -- Buscar mínimo de acerto do responsável
  select u.minimo_acerto into v_minimo_acerto
  from public.users resp
  join public.users aluno on aluno.id = new.aluno_id
  join public.users r on r.aluno_id = new.aluno_id and r.role = 'responsavel'
  limit 1;

  v_sessao_valida := new.percentual_acerto >= coalesce(v_minimo_acerto, 60);

  -- Atualizar status da sessão
  update public.sessoes
  set status = case when v_sessao_valida then 'valida' else 'invalida' end
  where id = new.sessao_id;

  -- Atualizar progresso por área
  insert into public.progresso_areas (aluno_id, area, total_questoes, total_corretas, percentual, tempo_total_segundos)
  values (new.aluno_id, v_area, new.total_questoes, new.total_corretas, new.percentual_acerto, new.tempo_total_segundos)
  on conflict (aluno_id, area) do update set
    total_questoes          = progresso_areas.total_questoes + new.total_questoes,
    total_corretas          = progresso_areas.total_corretas + new.total_corretas,
    percentual              = ((progresso_areas.total_corretas + new.total_corretas) * 100)
                              / nullif(progresso_areas.total_questoes + new.total_questoes, 0),
    tempo_total_segundos    = progresso_areas.tempo_total_segundos + new.tempo_total_segundos,
    tempo_medio_por_questao = (progresso_areas.tempo_total_segundos + new.tempo_total_segundos)
                              / nullif(progresso_areas.total_questoes + new.total_questoes, 0),
    updated_at              = now();

  -- Atualizar progresso geral
  update public.progresso_geral
  set
    total_sessoes_validas   = total_sessoes_validas   + case when v_sessao_valida then 1 else 0 end,
    total_sessoes_invalidas = total_sessoes_invalidas + case when v_sessao_valida then 0 else 1 end,
    ultima_atualizacao      = now()
  where aluno_id = new.aluno_id;

  return new;
end;
$$;

create trigger on_mini_prova_created
  after insert on public.mini_provas
  for each row execute procedure public.atualizar_progresso_apos_prova();

-- ════════════════════════════════════════════════════════════════
-- REALTIME (para painel do responsável ao vivo)
-- ════════════════════════════════════════════════════════════════
alter publication supabase_realtime add table public.sessoes;
alter publication supabase_realtime add table public.alertas_sessao;
alter publication supabase_realtime add table public.progresso_geral;
