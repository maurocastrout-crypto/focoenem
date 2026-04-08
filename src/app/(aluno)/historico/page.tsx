// src/app/(aluno)/historico/page.tsx
import { createClient } from '@/lib/supabase/server'
import { AREAS_ENEM, type AreaENEM } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function HistoricoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sessoes } = await supabase
    .from('sessoes')
    .select('*, mini_provas(*)')
    .eq('aluno_id', user!.id)
    .in('status', ['valida', 'invalida', 'finalizada'])
    .order('inicio', { ascending: false })
    .limit(50)

  const total       = sessoes?.length ?? 0
  const validas     = sessoes?.filter(s => s.status === 'valida').length ?? 0
  const invalidas   = sessoes?.filter(s => s.status === 'invalida').length ?? 0
  const tempoTotal  = sessoes?.reduce((acc, s) => acc + (s.duracao_segundos || 0), 0) ?? 0
  const hTotal      = Math.floor(tempoTotal / 3600)
  const mTotal      = Math.floor((tempoTotal % 3600) / 60)

  function formatDur(s: number) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-2xl font-bold mb-1">Histórico de Sessões</h1>
      <p className="text-muted text-sm mb-8">Todas as suas sessões de estudo</p>

      {/* Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total de sessões', val: total,                             cor: 'text-white' },
          { label: 'Sessões válidas',  val: validas,                           cor: 'text-accent' },
          { label: 'Não validadas',    val: invalidas,                         cor: 'text-danger' },
          { label: 'Horas estudadas',  val: `${hTotal}h ${mTotal}m`,           cor: 'text-accent2' },
        ].map((s, i) => (
          <div key={i} className="card text-center">
            <div className={`font-display text-2xl font-bold ${s.cor}`}>{s.val}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/7">
                {['Data', 'Matéria / Tópico', 'Duração', 'Acerto', 'Status', 'Tempo/questão'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessoes?.map(s => {
                const prova   = s.mini_provas?.[0]
                const area    = AREAS_ENEM[s.area as AreaENEM]
                const acerto  = prova?.percentual_acerto
                const tempoMQ = prova ? Math.round(prova.tempo_total_segundos / prova.total_questoes) : null

                // Questão mais demorada
                const respostas = prova?.respostas as any[] ?? []
                const maisLenta = respostas.length
                  ? respostas.reduce((a: any, b: any) => a.tempo_segundos > b.tempo_segundos ? a : b)
                  : null

                return (
                  <tr key={s.id} className="border-t border-white/5 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                      {format(new Date(s.inicio), "dd/MM · HH'h'mm", { locale: ptBR })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{area?.emoji} {area?.label}</div>
                      <div className="text-xs text-muted mt-0.5">{s.topico}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-display font-bold text-sm text-accent">
                        {formatDur(s.duracao_segundos || 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-display font-bold text-sm ${acerto == null ? 'text-muted' : acerto >= 70 ? 'text-accent2' : 'text-danger'}`}>
                        {acerto != null ? `${acerto}%` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.status === 'valida' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}`}>
                        {s.status === 'valida' ? '✓ Válida' : '✗ Inválida'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {maisLenta ? (
                        <div>
                          <span className={`font-display font-bold ${maisLenta.tempo_segundos > 180 ? 'text-danger' : maisLenta.tempo_segundos > 90 ? 'text-warn' : 'text-accent'}`}>
                            {maisLenta.tempo_segundos}s
                          </span>
                          {maisLenta.tempo_segundos > 180 && <span className="text-danger ml-1">⚠</span>}
                          <div className="text-muted truncate max-w-24">{maisLenta.topico}</div>
                        </div>
                      ) : <span className="text-muted">—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!sessoes?.length && (
          <div className="text-center py-12 text-muted text-sm">
            Nenhuma sessão ainda. <a href="/sessao" className="text-accent hover:underline">Começar agora →</a>
          </div>
        )}
      </div>
    </div>
  )
}
