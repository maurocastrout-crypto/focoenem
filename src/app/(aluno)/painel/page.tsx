// src/app/(aluno)/painel/page.tsx
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export default async function PainelAlunoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar dados do aluno
  const { data: aluno } = await supabase
    .from('users').select('*').eq('id', user!.id).single()

  // Buscar progresso geral
  const { data: progresso } = await supabase
    .from('progresso_geral').select('*').eq('aluno_id', user!.id).single()

  // Buscar sessões de hoje
  const hoje = format(new Date(), 'yyyy-MM-dd')
  const { data: sessoesHoje } = await supabase
    .from('sessoes')
    .select('*')
    .eq('aluno_id', user!.id)
    .gte('inicio', `${hoje}T00:00:00`)
    .order('inicio', { ascending: false })

  // Buscar sessões recentes (últimas 4)
  const { data: sessoesRecentes } = await supabase
    .from('sessoes')
    .select('*, mini_provas(*)')
    .eq('aluno_id', user!.id)
    .in('status', ['valida', 'invalida'])
    .order('inicio', { ascending: false })
    .limit(4)

  // Buscar progresso por área
  const { data: progressoAreas } = await supabase
    .from('progresso_areas')
    .select('*')
    .eq('aluno_id', user!.id)

  // Calcular meta
  const { data: responsavel } = await supabase
    .from('users').select('meta_horas_dia').eq('aluno_id', user!.id).eq('role', 'responsavel').single()

  const metaHoras    = responsavel?.meta_horas_dia ?? 3
  const tempoHoje    = (sessoesHoje ?? []).reduce((acc, s) => acc + (s.duracao_segundos || 0), 0)
  const horasHoje    = tempoHoje / 3600
  const pctMeta      = Math.min(Math.round((horasHoje / metaHoras) * 100), 100)
  const hh           = Math.floor(tempoHoje / 3600)
  const mm           = Math.floor((tempoHoje % 3600) / 60)
  const tempoHojeStr = hh > 0 ? `${hh}h ${mm}m` : `${mm}m`

  const sessaoAtiva = sessoesHoje?.find(s => s.status === 'em_andamento' || s.status === 'pausada')

  const diasParaEnem = aluno?.data_enem
    ? Math.ceil((new Date(aluno.data_enem).getTime() - Date.now()) / 86400000)
    : null

  const saudacao = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite'

  const areas = [
    { key: 'matematica',        label: 'Matemática',        emoji: '📐', cor: '#0066ff' },
    { key: 'linguagens',        label: 'Linguagens',        emoji: '📝', cor: '#8b5cf6' },
    { key: 'ciencias_natureza', label: 'C. Natureza',       emoji: '🔬', cor: '#f59e0b' },
    { key: 'ciencias_humanas',  label: 'C. Humanas',        emoji: '🌍', cor: '#00e5a0' },
    { key: 'redacao',           label: 'Redação',           emoji: '✍️', cor: '#ff4d6d' },
  ]

  return (
    <div className="animate-fade-up">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {saudacao}, {aluno?.nome} 👋
          </h1>
          <p className="text-muted text-sm mt-1">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            {diasParaEnem && (
              <> · ENEM em <strong className="text-accent">{diasParaEnem} dias</strong></>
            )}
          </p>
        </div>
        {(progresso?.streak_atual ?? 0) > 0 && (
          <div className="flex items-center gap-2 bg-warn/10 border border-warn/25 rounded-full px-4 py-2 font-display font-bold text-warn text-sm">
            🔥 {progresso?.streak_atual} dias seguidos
          </div>
        )}
      </div>

      {/* Sessão ativa */}
      {sessaoAtiva && (
        <div className="mb-6 bg-accent/5 border border-accent/20 rounded-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#00e5a0] animate-pulse-dot" />
            <span className="text-sm font-medium">Sessão em andamento — <strong className="text-accent">{sessaoAtiva.topico}</strong></span>
          </div>
          <Link href="/sessao" className="btn-primary text-sm py-2 px-4">Continuar →</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="card border-t-2 border-t-accent">
          <div className="text-2xl mb-3">⏱</div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Hoje estudado</div>
          <div className="font-display text-3xl font-bold text-accent">{tempoHojeStr}</div>
          <div className="text-xs text-muted mt-1.5">Meta: {metaHoras}h · <span className="text-accent">{pctMeta}%</span></div>
        </div>
        <div className="card border-t-2 border-t-accent2">
          <div className="text-2xl mb-3">🎯</div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Acerto hoje</div>
          <div className="font-display text-3xl font-bold text-accent2">
            {sessoesHoje?.length
              ? `${Math.round((sessoesHoje.filter(s => s.status === 'valida').length / sessoesHoje.length) * 100)}%`
              : '—'}
          </div>
          <div className="text-xs text-muted mt-1.5">{sessoesHoje?.length ?? 0} sessões hoje</div>
        </div>
        <div className="card border-t-2 border-t-warn">
          <div className="text-2xl mb-3">✅</div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Streak</div>
          <div className="font-display text-3xl font-bold text-warn">
            🔥 {progresso?.streak_atual ?? 0}
          </div>
          <div className="text-xs text-muted mt-1.5">dias consecutivos</div>
        </div>
      </div>

      {/* Meta + Áreas */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Meta do dia */}
        <div className="card">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Meta Diária</div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-display text-2xl font-bold text-accent">{tempoHojeStr}</span>
            <span className="text-sm text-muted">de {metaHoras}h</span>
          </div>
          <div className="h-2 bg-surface2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent transition-all"
              style={{ width: `${pctMeta}%`, boxShadow: '0 0 10px rgba(0,229,160,0.3)' }}
            />
          </div>
          <p className="text-xs text-muted mt-2">
            {pctMeta >= 100
              ? '🎉 Meta batida! Parabéns!'
              : `Faltam ${metaHoras - Math.floor(horasHoje)}h ${Math.round((metaHoras - horasHoje) % 1 * 60)}m`}
          </p>
          {!sessaoAtiva && (
            <Link href="/sessao" className="btn-primary block text-center text-sm py-2.5 mt-4 w-full">
              Iniciar sessão de estudo →
            </Link>
          )}
        </div>

        {/* Mapa de áreas */}
        <div className="card">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Progresso por Área</div>
          <div className="flex flex-col gap-2.5">
            {areas.map(a => {
              const prog = progressoAreas?.find(p => p.area === a.key)
              const pct  = prog?.percentual ?? 0
              return (
                <div key={a.key} className="flex items-center gap-2.5">
                  <span className="text-sm w-5">{a.emoji}</span>
                  <span className="text-xs text-muted w-24 flex-shrink-0">{a.label}</span>
                  <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: a.cor }} />
                  </div>
                  <span className="font-display text-xs font-bold w-8 text-right" style={{ color: a.cor }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sessões recentes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide">Sessões Recentes</div>
          <Link href="/historico" className="text-xs text-accent hover:underline">Ver todas →</Link>
        </div>
        <div className="flex flex-col gap-2">
          {sessoesRecentes?.length ? sessoesRecentes.map(s => {
            const dur  = s.duracao_segundos || 0
            const h    = Math.floor(dur / 3600)
            const m    = Math.floor((dur % 3600) / 60)
            const acerto = s.mini_provas?.[0]?.percentual_acerto
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-surface2 rounded-xl border border-white/7">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'valida' ? 'bg-accent shadow-[0_0_6px_#00e5a0]' : 'bg-danger'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.topico}</div>
                  <div className="text-xs text-muted mt-0.5">{format(new Date(s.inicio), "dd/MM · HH'h'mm", { locale: ptBR })}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display text-sm font-bold text-accent">{h > 0 ? `${h}h ${m}m` : `${m}m`}</div>
                  <div className={`text-xs font-bold ${acerto >= 70 ? 'text-accent2' : 'text-danger'}`}>
                    {acerto != null ? `${acerto}%` : '—'}
                  </div>
                </div>
              </div>
            )
          }) : (
            <p className="text-sm text-muted text-center py-4">Nenhuma sessão ainda. <Link href="/sessao" className="text-accent hover:underline">Começar agora →</Link></p>
          )}
        </div>
      </div>
    </div>
  )
}
