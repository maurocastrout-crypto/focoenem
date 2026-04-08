// ─── USUÁRIOS ──────────────────────────────────────────────────
export type UserRole = 'aluno' | 'responsavel'

export interface User {
  id: string
  email: string
  nome: string
  sobrenome: string
  whatsapp: string
  role: UserRole
  created_at: string
}

export interface Aluno extends User {
  role: 'aluno'
  data_enem: string | null
  meta_nota: number | null
  curso_desejado: string | null
  areas_fracas: AreaENEM[]
  responsavel_id: string | null
}

export interface Responsavel extends User {
  role: 'responsavel'
  aluno_id: string | null
  meta_horas_dia: number        // padrão: 3
  minimo_acerto: number         // padrão: 60 (%)
  horario_resumo: string        // padrão: "20:00"
  plano_ativo: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
}

// ─── ÁREAS DO ENEM ─────────────────────────────────────────────
export type AreaENEM =
  | 'matematica'
  | 'linguagens'
  | 'ciencias_natureza'
  | 'ciencias_humanas'
  | 'redacao'

export const AREAS_ENEM: Record<AreaENEM, { label: string; emoji: string; cor: string }> = {
  matematica:         { label: 'Matemática',          emoji: '📐', cor: '#0066ff' },
  linguagens:         { label: 'Linguagens',           emoji: '📝', cor: '#8b5cf6' },
  ciencias_natureza:  { label: 'Ciências da Natureza', emoji: '🔬', cor: '#f59e0b' },
  ciencias_humanas:   { label: 'Ciências Humanas',     emoji: '🌍', cor: '#00e5a0' },
  redacao:            { label: 'Redação',               emoji: '✍️', cor: '#ff4d6d' },
}

// ─── SESSÕES DE ESTUDO ─────────────────────────────────────────
export type StatusSessao = 'em_andamento' | 'pausada' | 'finalizada' | 'valida' | 'invalida'

export interface Sessao {
  id: string
  aluno_id: string
  area: AreaENEM
  topico: string
  inicio: string
  fim: string | null
  duracao_segundos: number
  status: StatusSessao
  pausas: Pausa[]
  alertas: AlertaSessao[]
  created_at: string
}

export interface Pausa {
  inicio: string
  fim: string | null
  motivo: 'manual' | 'inatividade' | 'saiu_app'
}

export type TipoAlerta = 'inatividade' | 'saiu_app' | 'troca_tela' | 'tela_parada'

export interface AlertaSessao {
  tipo: TipoAlerta
  timestamp: string
  detalhes?: string
}

// ─── MINI-PROVA ────────────────────────────────────────────────
export type ResultadoQuestao = 'correta' | 'errada' | 'pulada'

export interface RespostaQuestao {
  questao_id: string
  resposta_escolhida: string | null
  resultado: ResultadoQuestao
  tempo_segundos: number        // ← tempo que ficou nessa questão
}

export interface MiniProva {
  id: string
  sessao_id: string
  aluno_id: string
  questoes: RespostaQuestao[]
  total_questoes: number
  total_corretas: number
  percentual_acerto: number
  tempo_total_segundos: number
  valida: boolean               // true se >= minimo_acerto do responsável
  created_at: string
}

// ─── QUESTÕES ──────────────────────────────────────────────────
export type Dificuldade = 'facil' | 'medio' | 'dificil'

export interface Questao {
  id: string
  area: AreaENEM
  topico: string
  subtopico: string
  ano_enem: number | null
  enunciado: string
  alternativas: Alternativa[]
  resposta_correta: string      // 'A' | 'B' | 'C' | 'D' | 'E'
  dificuldade: Dificuldade
  explicacao: string | null
}

export interface Alternativa {
  letra: string
  texto: string
}

// ─── PROGRESSO ─────────────────────────────────────────────────
export interface ProgressoArea {
  area: AreaENEM
  total_questoes: number
  total_corretas: number
  percentual: number
  tempo_total_segundos: number
  tempo_medio_por_questao: number
  topicos_fortes: string[]
  topicos_fracos: string[]
}

export interface ProgressoGeral {
  aluno_id: string
  streak_atual: number
  streak_maximo: number
  total_horas_estudadas: number
  total_sessoes_validas: number
  total_sessoes_invalidas: number
  acerto_geral: number
  areas: ProgressoArea[]
  ultima_atualizacao: string
}

// ─── NOTIFICAÇÕES WHATSAPP ─────────────────────────────────────
export interface ResumoWhatsApp {
  responsavel_id: string
  aluno_nome: string
  data: string
  tempo_estudado_minutos: number
  meta_horas: number
  sessoes_validas: number
  sessoes_invalidas: number
  acerto_medio: number
  materias_estudadas: {
    area: AreaENEM
    topico: string
    duracao_minutos: number
    acerto: number | null
    valida: boolean
  }[]
  alertas_comportamento: AlertaSessao[]
  streak: number
  topicos_com_dificuldade: {
    topico: string
    tempo_medio_segundos: number
  }[]
}

// ─── ASSINATURA ────────────────────────────────────────────────
export interface Assinatura {
  id: string
  responsavel_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  proximo_pagamento: string
  created_at: string
}

// ─── API RESPONSES ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}
