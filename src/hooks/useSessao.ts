// src/hooks/useSessao.ts
// Toda a lógica do cronômetro: pausas, inatividade, detecção de saída do app

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AlertaSessao, AreaENEM, Pausa, TipoAlerta } from '@/types'

interface UseSessaoProps {
  alunoId: string
  area: AreaENEM
  topico: string
}

export function useSessao({ alunoId, area, topico }: UseSessaoProps) {
  const [sessaoId, setSessaoId]     = useState<string | null>(null)
  const [segundos, setSegundos]     = useState(0)
  const [rodando, setRodando]       = useState(false)
  const [pausas, setPausas]         = useState<Pausa[]>([])
  const [alertas, setAlertas]       = useState<AlertaSessao[]>([])
  const [pausaAtual, setPausaAtual] = useState<Pausa | null>(null)

  const intervaloRef      = useRef<NodeJS.Timeout | null>(null)
  const inativoRef        = useRef<NodeJS.Timeout | null>(null)
  const telaParadaRef     = useRef<NodeJS.Timeout | null>(null)
  const trocaTelaRef      = useRef<number>(0)
  const trocaTelaTimerRef = useRef<NodeJS.Timeout | null>(null)
  const supabase          = createClient()

  // ── Iniciar sessão ──────────────────────────────────────────
  const iniciar = useCallback(async () => {
    const { data, error } = await supabase
      .from('sessoes')
      .insert({ aluno_id: alunoId, area, topico, status: 'em_andamento', inicio: new Date().toISOString() })
      .select()
      .single()

    if (error || !data) return

    setSessaoId(data.id)
    setRodando(true)
    setSegundos(0)
    setPausas([])
    setAlertas([])
  }, [alunoId, area, topico, supabase])

  // ── Cronômetro ──────────────────────────────────────────────
  useEffect(() => {
    if (rodando) {
      intervaloRef.current = setInterval(() => setSegundos(s => s + 1), 1000)
    } else {
      if (intervaloRef.current) clearInterval(intervaloRef.current)
    }
    return () => { if (intervaloRef.current) clearInterval(intervaloRef.current) }
  }, [rodando])

  // ── Registrar alerta ────────────────────────────────────────
  const registrarAlerta = useCallback(async (tipo: TipoAlerta, detalhes?: string) => {
    const alerta: AlertaSessao = { tipo, timestamp: new Date().toISOString(), detalhes }
    setAlertas(prev => [...prev, alerta])

    if (sessaoId) {
      await supabase.from('alertas_sessao').insert({
        sessao_id: sessaoId,
        aluno_id: alunoId,
        tipo,
        detalhes,
        timestamp: alerta.timestamp,
      })
    }
  }, [sessaoId, alunoId, supabase])

  // ── Pausar ──────────────────────────────────────────────────
  const pausar = useCallback(async (motivo: Pausa['motivo'] = 'manual') => {
    if (!rodando || !sessaoId) return
    setRodando(false)
    const pausa: Pausa = { inicio: new Date().toISOString(), fim: null, motivo }
    setPausaAtual(pausa)
    await supabase.from('sessoes').update({ status: 'pausada' }).eq('id', sessaoId)
  }, [rodando, sessaoId, supabase])

  // ── Retomar ─────────────────────────────────────────────────
  const retomar = useCallback(async () => {
    if (rodando || !sessaoId) return
    const fim = new Date().toISOString()
    setPausas(prev => [...prev, { ...pausaAtual!, fim }])
    setPausaAtual(null)
    setRodando(true)
    await supabase.from('sessoes').update({ status: 'em_andamento' }).eq('id', sessaoId)
  }, [rodando, sessaoId, pausaAtual, supabase])

  // ── Finalizar ───────────────────────────────────────────────
  const finalizar = useCallback(async () => {
    if (!sessaoId) return
    setRodando(false)
    await supabase.from('sessoes').update({
      status: 'finalizada',
      fim: new Date().toISOString(),
      duracao_segundos: segundos,
      pausas,
      alertas,
    }).eq('id', sessaoId)
    return sessaoId
  }, [sessaoId, segundos, pausas, alertas, supabase])

  // ── Detecção de inatividade (30s sem movimento) ─────────────
  const resetInativo = useCallback(() => {
    if (inativoRef.current) clearTimeout(inativoRef.current)
    if (!rodando) return
    inativoRef.current = setTimeout(() => {
      registrarAlerta('inatividade', 'Sem interação por 30 segundos')
      pausar('inatividade')
    }, 30_000)
  }, [rodando, pausar, registrarAlerta])

  useEffect(() => {
    if (!rodando) return
    const eventos = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll']
    eventos.forEach(e => window.addEventListener(e, resetInativo))
    resetInativo()
    return () => {
      eventos.forEach(e => window.removeEventListener(e, resetInativo))
      if (inativoRef.current) clearTimeout(inativoRef.current)
    }
  }, [rodando, resetInativo])

  // ── Detecção de saída do app (visibilidade da aba) ──────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && rodando) {
        registrarAlerta('saiu_app', 'Aluno saiu do app')
        pausar('saiu_app')
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [rodando, pausar, registrarAlerta])

  // ── Detecção de troca de tela frequente ─────────────────────
  useEffect(() => {
    const handleFocus = () => {
      if (!rodando) return
      trocaTelaRef.current++
      if (trocaTelaTimerRef.current) clearTimeout(trocaTelaTimerRef.current)
      trocaTelaTimerRef.current = setTimeout(() => { trocaTelaRef.current = 0 }, 180_000) // janela de 3min
      if (trocaTelaRef.current >= 5) {
        registrarAlerta('troca_tela', `${trocaTelaRef.current} trocas em 3 minutos`)
        trocaTelaRef.current = 0
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [rodando, registrarAlerta])

  return {
    sessaoId,
    segundos,
    rodando,
    pausas,
    alertas,
    iniciar,
    pausar: () => pausar('manual'),
    retomar,
    finalizar,
  }
}
