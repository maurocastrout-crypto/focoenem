'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AREAS_ENEM, type AreaENEM } from '@/types'

export default function PainelResponsavelClient({
  responsavel, aluno, progresso, progressoAreas,
  sessoesHoje, alertasHoje, sessaoAtiva,
  tempoStr, pctMeta, metaHoras, acertoMedio,
  validas, invalidas, respostasAnalisadas, alunoId,
}: any) {
  const supabase = createClient()
  const [ativa, setAtiva] = useState(sessaoAtiva)
  const [alertas, setAlertas] = useState(alertasHoje)
  const [timerSeg, setTimerSeg] = useState(0)

  useEffect(() => {
    const channel = supabase
      .channel('sessao-aluno')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'sessoes',
        filter: `aluno_id=eq.${alunoId}`,
      }, (payload: any) => {
        const s = payload.new as any
        if (s.status === 'em_andamento' || s.status === 'pausada') {
          setAtiva(s)
        } else {
          setAtiva(null)
        }
      })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'alertas_sessao',
        filter: `aluno_id=eq.${alunoId}`,
      }, (payload: any) => {
        setAlertas((prev: any[]) => [payload.new, ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [alunoId, supabase])

  useEffect(() => {
    if (!ativa) return
    const interval = setInterval(() => setTimerSeg(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [ativa])

  function pad(n: number) { return String(n).padStart(2, '0') }
  function timerStr(s: number) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return pad(h) + ':' + pad(m) + ':' + pad(sec)
  }

  const tiposAlerta: Record<string, string> = {
    inatividade: '💤 Inatividade detectada',
    saiu_app: '📱 Saiu do app',
    troca_tela: '🔄 Trocas de tela frequentes',
    tela_parada: '⏸ Tela parada por muito tempo',
  }

  const nomeAluno = (aluno?.nome || '') + ' ' + (aluno?.sobrenome || '')
  const iniciais = aluno ? (aluno.nome[0] + aluno.sobrenome[0]) : '??'

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Ola, {responsavel?.nome} 👋</h1>
          <p className="text-muted text-sm mt-1">Acompanhamento de <strong className="text-white">{nomeAluno}</strong></p>
        </div>
        {ativa && (
          <div className="flex items-center gap-2 border border-accent/20 rounded-full px-4 py-2 text-sm font-semibold text-accent">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {nomeAluno} esta estudando agora
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { icon: '⏱', label: 'Tempo hoje',    val: tempoStr,          cor: 'text-accent',  border: 'border-t-accent',  sub: 'Meta: ' + metaHoras + 'h · ' + pctMeta + '%' },
          { icon: '🎯', label: 'Acerto medio',  val: acertoMedio + '%', cor: 'text-accent2', border: 'border-t-accent2', sub: (validas + invalidas) + ' sessoes hoje' },
          { icon: '🔥', label: 'Streak',        val: (progresso?.streak_atual ?? 0) + ' dias', cor: 'text-warn', border: 'border-t-warn', sub: 'consecutivos' },
          { icon: '⚠',  label: 'Alertas hoje', val: alertas.length,    cor: alertas.length > 0 ? 'text-danger' : 'text-muted', border: 'border-t-danger', sub: 'comportamentais' },
        ].map((s, i) => (
          <div key={i} className={'card border-t-2 ' + s.border}>
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">{s.label}</div>
            <div className={'font-display text-2xl font-bold ' + s.cor}>{s.val}</div>
            <div className="text-xs text-muted mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {ativa && (
        <div className="mb-5 border border-accent/15 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold">📡 Ao Vivo</div>
            <div className="flex items-center gap-2 text-xs text-accent font-semibold">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />Tempo real
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-display font-bold text-lg">
              {iniciais}
            </div>
            <div>
              <div className="font-display font-bold">{nomeAluno}</div>
              <div className="text-sm text-muted mt-0.5">Estudando <strong className="text-accent">{ativa.topico}</strong></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Tempo na sessao', val: timerStr(timerSeg), cor: 'text-accent' },
              { label: 'Sessoes hoje', val: validas + invalidas, cor: 'text-accent2' },
              { label: 'Status', val: ativa.status === 'em_andamento' ? 'Ativo' : 'Pausado', cor: ativa.status === 'em_andamento' ? 'text-accent' : 'text-warn' },
            ].map((s, i) => (
              <div key={i} className="border border-white/7 rounded-xl p-3 text-center">
                <div className={'font-display text-lg font-bold ' + s.cor}>{s.val}</div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
            🔍 Analise por Questao
          </div>
          {respostasAnalisadas.length > 0 ? (
            <div className="flex flex-col gap-2">
              {respostasAnalisadas.slice(0, 8).map((r: any, i: number) => {
                const maxTempo = Math.max(...respostasAnalisadas.map((x: any) => x.tempo))
                const pct = maxTempo > 0 ? (r.tempo / maxTempo) * 100 : 0
                const cor = r.tempo > 180 ? '#ff4d6d' : r.tempo > 90 ? '#f59e0b' : '#00e5a0'
                return (
                  <div key={i} className="grid gap-2 items-center text-xs" style={{ gridTemplateColumns: '28px 1fr 80px 70px 60px' }}>
                    <span className="text-muted font-bold">Q{r.num}</span>
                    <span className="text-muted truncate">{r.topico}</span>
                    <span className={'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ' + (r.resultado === 'correta' ? 'bg-accent/10 text-accent' : r.resultado === 'errada' ? 'bg-danger/10 text-danger' : 'bg-white/5 text-muted')}>
                      {r.resultado === 'correta' ? 'Certo' : r.resultado === 'errada' ? 'Errado' : 'Pulou'}
                    </span>
                    <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct + '%', background: cor }} />
                    </div>
                    <span className="font-bold text-right" style={{ color: cor }}>{r.tempo}s</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-6">Nenhuma mini-prova ainda hoje.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">⚠ Alertas</div>
            {alertas.length > 0 ? (
              <div className="flex flex-col gap-2">
                {alertas.slice(0, 4).map((a: any, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 border border-warn/15 rounded-lg text-xs">
                    <div>
                      <div className="text-warn">{tiposAlerta[a.tipo]}</div>
                      <div className="text-muted mt-0.5">{new Date(a.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-3">Nenhum alerta hoje</p>
            )}
          </div>

          <div className="card">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Progresso por Area</div>
            <div className="flex flex-col gap-2.5">
              {(Object.entries(AREAS_ENEM) as [AreaENEM, any][]).map(([key, val]) => {
                const a = progressoAreas?.find((p: any) => p.area === key)
                const pct = a?.percentual ?? 0
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-sm w-5">{val.emoji}</span>
                    <span className="text-xs text-muted w-24 flex-shrink-0">{val.label}</span>
                    <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct + '%', background: val.cor }} />
                    </div>
                    <span className="font-bold text-xs w-8 text-right" style={{ color: val.cor }}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
