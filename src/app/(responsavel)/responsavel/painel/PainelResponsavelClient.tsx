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
  const [ativa, setAtiva]     = useState(sessaoAtiva)
  const [alertas, setAlertas] = useState(alertasHoje)
  const [timerSeg, setTimerSeg] = useState(0)

  useEffect(() => {
    const channel = supabase
      .channel('sessao-aluno')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'sessoes',
        filter: `aluno_id=eq.${alunoId}`,
      }, payload => {
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
      }, payload => {
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
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return `${pad(h)}:${pad(m)}:${pad(sec)}`
  }

  const tiposAlerta: Record<string, string> = {
    inatividade: '💤 Inatividade detectada',
    saiu_app: '📱 Saiu do app',
    troca_tela: '🔄 Trocas de tela frequentes',
    tela_parada: '⏸ Tela parada por muito tempo',
  }

  const nomeAluno = `${aluno?.nome} ${aluno?.sobrenome}`
  const iniciais  = aluno ? `${aluno.nome[0]}${aluno.sobrenome[0]}` : '??'

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Olá, {responsavel?.nome} 👋</h1>
          <p className="text-muted text-sm mt-1">Acompanhamento de <strong className="text-white">{nomeAluno}</strong></p>
        </div>
        {ativa && (
          <div className="flex items-center gap-2 bg-accent/8 border border-accent/20 rounded-full px-4 py-2 text-sm font-semibold text-accent">
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#00e5a0] animate-pulse-dot" />
            {nomeAluno} está estudando agora
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
