// src/app/(aluno)/progresso/page.tsx
import { createClient } from '@/lib/supabase/server'
import { AREAS_ENEM, type AreaENEM } from '@/types'

export default async function ProgressoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: progresso } = await supabase
    .from('progresso_geral').select('*').eq('aluno_id', user!.id).single()

  const { data: areas } = await supabase
    .from('progresso_areas').select('*').eq('aluno_id', user!.id)

  const { data: sessoes } = await supabase
    .from('sessoes')
    .select('inicio, status, duracao_segundos')
    .eq('aluno_id', user!.id)
    .order('inicio', { ascending: false })
    .limit(60)

  // Montar calendário com intensidade por dia
  const diasMap: Record<string, number> = {}
  sessoes?.forEach(s => {
    const dia = s.inicio.slice(0, 10)
    diasMap[dia] = (diasMap[dia] || 0) + (s.duracao_segundos || 0)
  })

  const areasList = Object.entries(AREAS_ENEM) as [AreaENEM, any][]

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-2xl font-bold mb-1">Meu Progresso</h1>
      <p className="text-muted text-sm mb-8">Visão completa do seu desempenho no ENEM</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: '⏱', label: 'Total estudado', val: `${Math.floor((progresso?.total_horas_estudadas ?? 0))}h`, cor: 'text-accent', border: 'border-t-accent' },
          { icon: '🎯', label: 'Acerto geral',   val: `${progresso?.acerto_geral ?? 0}%`,                     cor: 'text-accent2', border: 'border-t-accent2' },
          { icon: '✅', label: 'Sessões válidas', val: `${progresso?.total_sessoes_validas ?? 0}`,              cor: 'text-warn',    border: 'border-t-warn' },
          { icon: '🔥', label: 'Streak atual',    val: `${progresso?.streak_atual ?? 0} dias`,                 cor: 'text-warn',    border: 'border-t-warn' },
        ].map((s, i) => (
          <div key={i} className={`card border-t-2 ${s.border}`}>
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">{s.label}</div>
            <div className={`font-display text-2xl font-bold ${s.cor}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Progresso por área */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="card">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">Desempenho por Área</div>
          <div className="flex flex-col gap-4">
            {areasList.map(([key, val]) => {
              const a = areas?.find(x => x.area === key)
              const pct = a?.percentual ?? 0
              const horas = Math.floor((a?.tempo_total_segundos ?? 0) / 3600)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{val.emoji} {val.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">{horas}h</span>
                      <span className="font-display font-bold text-sm" style={{ color: val.cor }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: val.cor }} />
                  </div>
                  {a?.topicos_fracos?.length > 0 && (
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {(a.topicos_fracos as string[]).slice(0, 3).map((t: string) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-danger/8 border border-danger/15 text-danger rounded-full">✗ {t}</span>
                      ))}
                      {(a.topicos_fortes as string[]).slice(0, 2).map((t: string) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-accent/8 border border-accent/15 text-accent rounded-full">✓ {t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Calendário */}
        <div className="card">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">Calendário de Estudos</div>
          <CalendarioEstudos diasMap={diasMap} />
          <div className="flex items-center gap-2 mt-3 text-xs text-muted">
            <span>Menos</span>
            {['bg-surface2', 'bg-accent/20', 'bg-accent/45', 'bg-accent'].map(c => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>Mais</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de calendário inline
function CalendarioEstudos({ diasMap }: { diasMap: Record<string, number> }) {
  const hoje = new Date()
  const dias = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(hoje)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const segundos = diasMap[key] || 0
    const nivel = segundos === 0 ? 0 : segundos < 3600 ? 1 : segundos < 7200 ? 2 : segundos < 10800 ? 3 : 4
    dias.push({ key, dia: d.getDate(), nivel })
  }

  const cores = ['bg-surface2', 'bg-accent/20', 'bg-accent/40', 'bg-accent/70', 'bg-accent']

  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
      {dias.map(d => (
        <div key={d.key} title={d.key}
          className={`aspect-square rounded-md ${cores[d.nivel]} transition-transform hover:scale-110`} />
      ))}
    </div>
  )
}
