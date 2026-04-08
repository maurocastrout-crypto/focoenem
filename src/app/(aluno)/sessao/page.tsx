'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AREAS_ENEM, type AreaENEM } from '@/types'

const TOPICOS: Record<AreaENEM, string[]> = {
  matematica:         ['Funções','Equações','Geometria Plana','Geometria Espacial','Trigonometria','Probabilidade','Estatística','Progressões'],
  linguagens:         ['Interpretação de Texto','Literatura Brasileira','Gramática','Redação Dissertativa','Variação Linguística','Figuras de Linguagem'],
  ciencias_natureza:  ['Física — Mecânica','Física — Eletricidade','Química Orgânica','Química Inorgânica','Biologia Celular','Genética','Ecologia'],
  ciencias_humanas:   ['História do Brasil','História Mundial','Geografia Física','Geopolítica','Filosofia','Sociologia'],
  redacao:            ['Estrutura Dissertativa','Argumentação','Proposta de Intervenção','Revisão de Textos','Coesão e Coerência'],
}

type Etapa = 'selecao' | 'ativa' | 'prova' | 'resultado'

interface Questao {
  id: string
  enunciado: string
  alternativas: { letra: string; texto: string }[]
  area: string
  topico: string
  dificuldade: string
}

interface Resposta {
  questao_id: string
  resposta_escolhida: string | null
  tempo_segundos: number
  topico: string
}

function pad(n: number) { return String(n).padStart(2, '0') }
function formatTempo(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

export default function SessaoPage() {
  const router   = useRouter()
  const supabase = createClient()

  // ── Etapas ───────────────────────────────────────────────────
  const [etapa, setEtapa]             = useState<Etapa>('selecao')
  const [area, setArea]               = useState<AreaENEM | null>(null)
  const [topico, setTopico]           = useState<string | null>(null)

  // ── Sessão ───────────────────────────────────────────────────
  const [sessaoId, setSessaoId]       = useState<string | null>(null)
  const [segundos, setSegundos]       = useState(0)
  const [rodando, setRodando]         = useState(false)
  const [alertas, setAlertas]         = useState<string[]>([])
  const intervaloRef                  = useRef<NodeJS.Timeout | null>(null)
  const inativoRef                    = useRef<NodeJS.Timeout | null>(null)
  const trocaTelaCount                = useRef(0)

  // ── Mini-prova ───────────────────────────────────────────────
  const [questoes, setQuestoes]       = useState<Questao[]>([])
  const [questaoIdx, setQuestaoIdx]   = useState(0)
  const [respostas, setRespostas]     = useState<Resposta[]>([])
  const [respostaSel, setRespostaSel] = useState<string | null>(null)
  const [tempoQuestao, setTempoQ]     = useState(0)
  const [tempoProva, setTempoProva]   = useState(300) // 5min por questão
  const timerQRef                     = useRef<NodeJS.Timeout | null>(null)
  const timerProvaRef                 = useRef<NodeJS.Timeout | null>(null)

  // ── Resultado ────────────────────────────────────────────────
  const [resultado, setResultado]     = useState<any>(null)

  // ── Cronômetro ───────────────────────────────────────────────
  useEffect(() => {
    if (rodando) {
      intervaloRef.current = setInterval(() => setSegundos(s => s + 1), 1000)
    } else {
      if (intervaloRef.current) clearInterval(intervaloRef.current)
    }
    return () => { if (intervaloRef.current) clearInterval(intervaloRef.current) }
  }, [rodando])

  // ── Detecção de inatividade ───────────────────────────────────
  const resetInativo = useCallback(() => {
    if (inativoRef.current) clearTimeout(inativoRef.current)
    if (!rodando) return
    inativoRef.current = setTimeout(() => {
      setRodando(false)
      setAlertas(prev => [...prev, '💤 Inatividade detectada — sessão pausada automaticamente'])
      if (sessaoId) supabase.from('sessoes').update({ status: 'pausada' }).eq('id', sessaoId)
    }, 30_000)
  }, [rodando, sessaoId, supabase])

  useEffect(() => {
    if (!rodando) return
    const eventos = ['mousemove', 'keydown', 'click', 'touchstart']
    eventos.forEach(e => window.addEventListener(e, resetInativo))
    resetInativo()
    return () => {
      eventos.forEach(e => window.removeEventListener(e, resetInativo))
      if (inativoRef.current) clearTimeout(inativoRef.current)
    }
  }, [rodando, resetInativo])

  // ── Detecção de saída do app ──────────────────────────────────
  useEffect(() => {
    const handle = () => {
      if (document.hidden && rodando) {
        setRodando(false)
        setAlertas(prev => [...prev, '📱 Você saiu do app — sessão pausada'])
        if (sessaoId) supabase.from('sessoes').update({ status: 'pausada' }).eq('id', sessaoId)
      }
    }
    document.addEventListener('visibilitychange', handle)
    return () => document.removeEventListener('visibilitychange', handle)
  }, [rodando, sessaoId, supabase])

  // ── Detecção de troca de tela ─────────────────────────────────
  useEffect(() => {
    const handle = () => {
      if (!rodando) return
      trocaTelaCount.current++
      if (trocaTelaCount.current >= 5) {
        setAlertas(prev => [...prev, `🔄 ${trocaTelaCount.current} trocas de tela detectadas — alerta enviado ao responsável`])
        trocaTelaCount.current = 0
        if (sessaoId) supabase.from('alertas_sessao').insert({ sessao_id: sessaoId, tipo: 'troca_tela' })
      }
    }
    window.addEventListener('focus', handle)
    return () => window.removeEventListener('focus', handle)
  }, [rodando, sessaoId, supabase])

  // ── Iniciar sessão ────────────────────────────────────────────
  async function iniciarSessao() {
    if (!area || !topico) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from('sessoes').insert({
      aluno_id: user.id, area, topico, status: 'em_andamento', inicio: new Date().toISOString()
    }).select().single()

    if (data) {
      setSessaoId(data.id)
      setRodando(true)
      setEtapa('ativa')
      // Notificar responsável
      fetch('/api/sessoes/finalizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area, topico }),
      })
    }
  }

  // ── Pausar / Retomar ──────────────────────────────────────────
  function togglePausa() {
    const novoEstado = !rodando
    setRodando(novoEstado)
    if (sessaoId) supabase.from('sessoes').update({ status: novoEstado ? 'em_andamento' : 'pausada' }).eq('id', sessaoId)
  }

  // ── Finalizar e ir para mini-prova ────────────────────────────
  async function finalizarSessao() {
    setRodando(false)
    if (sessaoId) {
      await supabase.from('sessoes').update({
        status: 'finalizada', fim: new Date().toISOString(), duracao_segundos: segundos
      }).eq('id', sessaoId)
    }
    // Buscar questões
    const res = await fetch(`/api/questoes/mini-prova?area=${area}&topico=${encodeURIComponent(topico!)}&qtd=8`)
    const data = await res.json()
    setQuestoes(data.questoes ?? [])
    setQuestaoIdx(0)
    setRespostas([])
    setRespostaSel(null)
    setTempoQ(0)
    setTempoProva(300)
    setEtapa('prova')
    iniciarTimerProva()
    iniciarTimerQuestao()
  }

  // ── Timers da prova ───────────────────────────────────────────
  function iniciarTimerQuestao() {
    if (timerQRef.current) clearInterval(timerQRef.current)
    setTempoQ(0)
    timerQRef.current = setInterval(() => setTempoQ(t => t + 1), 1000)
  }

  function iniciarTimerProva() {
    if (timerProvaRef.current) clearInterval(timerProvaRef.current)
    timerProvaRef.current = setInterval(() => {
      setTempoProva(t => {
        if (t <= 1) { clearInterval(timerProvaRef.current!); submeterProva(); return 0 }
        return t - 1
      })
    }, 1000)
  }

  // ── Responder questão ─────────────────────────────────────────
  function responderQuestao(proxima: boolean) {
    if (timerQRef.current) clearInterval(timerQRef.current)
    const q = questoes[questaoIdx]
    const nova: Resposta = {
      questao_id: q.id,
      resposta_escolhida: proxima ? respostaSel : null,
      tempo_segundos: tempoQuestao,
      topico: q.topico,
    }
    const novasRespostas = [...respostas, nova]
    setRespostas(novasRespostas)

    if (questaoIdx + 1 >= questoes.length) {
      clearInterval(timerProvaRef.current!)
      submeterProvaComRespostas(novasRespostas)
    } else {
      setQuestaoIdx(i => i + 1)
      setRespostaSel(null)
      iniciarTimerQuestao()
    }
  }

  async function submeterProva() {
    const novasRespostas = [...respostas]
    // Preencher questões não respondidas
    questoes.slice(questaoIdx).forEach(q => {
      novasRespostas.push({ questao_id: q.id, resposta_escolhida: null, tempo_segundos: 0, topico: q.topico })
    })
    submeterProvaComRespostas(novasRespostas)
  }

  async function submeterProvaComRespostas(rs: Resposta[]) {
    const res = await fetch('/api/sessoes/finalizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessao_id: sessaoId, respostas: rs }),
    })
    const data = await res.json()
    setResultado(data)
    setEtapa('resultado')
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  // ── SELEÇÃO ──────────────────────────────────────────────────
  if (etapa === 'selecao') return (
    <div className="max-w-3xl animate-fade-up">
      <h1 className="font-display text-2xl font-bold mb-1">Nova Sessão de Estudo</h1>
      <p className="text-muted text-sm mb-8">Escolha a matéria e o tópico para começar</p>

      <div className="mb-8">
        <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Qual matéria você vai estudar?</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.entries(AREAS_ENEM) as [AreaENEM, any][]).map(([key, val]) => (
            <button key={key} onClick={() => { setArea(key); setTopico(null) }}
              className={`p-4 rounded-xl border text-left transition-all ${area === key ? 'border-accent bg-accent/6' : 'border-white/7 bg-surface hover:border-white/20 hover:bg-surface2'}`}>
              <div className="text-2xl mb-2">{val.emoji}</div>
              <div className="font-display font-bold text-sm">{val.label}</div>
            </button>
          ))}
        </div>
      </div>

      {area && (
        <div className="mb-8 animate-fade-up">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Escolha o tópico</div>
          <div className="grid grid-cols-2 gap-2">
            {TOPICOS[area].map(t => (
              <button key={t} onClick={() => setTopico(t)}
                className={`px-4 py-3 rounded-xl border text-sm text-left transition-all ${topico === t ? 'border-accent2 bg-accent2/8 text-white' : 'border-white/7 bg-surface text-muted hover:text-white hover:border-white/20'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={iniciarSessao} disabled={!area || !topico}
        className="btn-primary px-8 py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed">
        Iniciar sessão de estudo →
      </button>
    </div>
  )

  // ── SESSÃO ATIVA ─────────────────────────────────────────────
  if (etapa === 'ativa') {
    const pct = Math.min(segundos / 10800, 1)
    const circ = 2 * Math.PI * 100
    return (
      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up">
        {/* Cronômetro */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0d1b2e] to-[#0a1520] border border-accent/15 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="flex items-center gap-2 bg-surface2 border border-white/7 rounded-full px-3 py-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_#00e5a0] animate-pulse-dot" />
              {area ? AREAS_ENEM[area].label : ''}
            </span>
            <span className="flex items-center gap-2 bg-surface2 border border-white/7 rounded-full px-3 py-1.5 text-sm text-muted">{topico}</span>
          </div>

          <div className="relative w-56 h-56 mx-auto mb-6">
            <svg className="-rotate-90 w-full h-full" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle cx="110" cy="110" r="100" fill="none" stroke="#00e5a0" strokeWidth="10"
                strokeLinecap="round" strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                style={{ filter: 'drop-shadow(0 0 10px #00e5a0)', transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-4xl font-bold tracking-tight">{formatTempo(segundos)}</div>
              <div className="text-xs text-accent tracking-widest mt-1">{rodando ? 'EM ANDAMENTO' : 'PAUSADO'}</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center mb-4">
            <button onClick={togglePausa}
              className="btn-secondary px-5 py-2.5 text-sm">
              {rodando ? '⏸ Pausar' : '▶ Continuar'}
            </button>
            <button onClick={finalizarSessao} disabled={segundos < 60}
              className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-40">
              Finalizar e responder mini-prova →
            </button>
          </div>

          {segundos < 60 && (
            <p className="text-xs text-muted">Mínimo 1 minuto para finalizar</p>
          )}

          {/* Alertas */}
          <div className="flex flex-col gap-2 mt-4">
            {alertas.slice(-2).map((a, i) => (
              <div key={i} className="flex items-center gap-2 bg-warn/8 border border-warn/20 rounded-lg px-3 py-2 text-xs text-warn text-left">
                {a}
              </div>
            ))}
            {alertas.length === 0 && (
              <div className="flex items-center gap-2 bg-accent/5 border border-accent/15 rounded-lg px-3 py-2 text-xs text-accent">
                ✓ App em foco — sessão sendo contabilizada
              </div>
            )}
          </div>
        </div>

        {/* Sidebar da sessão */}
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Checklist</div>
            {[
              { label: 'Matéria selecionada', ok: true },
              { label: 'Tópico definido', ok: true },
              { label: 'Cronômetro ativo', ok: rodando },
              { label: 'Mínimo 30 min', ok: segundos >= 1800 },
              { label: 'Mini-prova pendente', ok: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${item.ok ? 'bg-accent/15 text-accent' : 'bg-surface2 text-muted border border-white/7'}`}>
                  {item.ok ? '✓' : '–'}
                </div>
                <span className={`text-sm ${item.ok ? 'text-white' : 'text-muted'}`}>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="card bg-warn/5 border-warn/15">
            <div className="text-xs font-semibold text-warn uppercase tracking-wide mb-2">Monitoramento ativo</div>
            <div className="text-xs text-muted leading-7">
              🔍 Saída do app → pausa automática<br />
              💤 Inatividade → pausa automática<br />
              📱 Troca frequente → alerta ao pai<br />
              ⏳ Tela parada → alerta
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── MINI-PROVA ───────────────────────────────────────────────
  if (etapa === 'prova' && questoes.length > 0) {
    const q = questoes[questaoIdx]
    return (
      <div className="max-w-2xl mx-auto animate-fade-up">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-danger uppercase tracking-wide mb-1">⚠ Validação obrigatória</div>
              <div className="font-display text-xl font-bold">Mini-Prova da Sessão</div>
              <div className="text-xs text-muted mt-1">{AREAS_ENEM[area!]?.label} · Mínimo 60% para validar</div>
            </div>
            <div className="font-display font-bold text-warn text-sm">⏱ {formatTempo(tempoProva)}</div>
          </div>

          {/* Progresso */}
          <div className="flex gap-1.5 mb-6">
            {questoes.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < questaoIdx ? 'bg-accent' : i === questaoIdx ? 'bg-accent shadow-[0_0_6px_#00e5a0]' : 'bg-surface2'}`} />
            ))}
          </div>

          <p className="text-sm leading-relaxed mb-5 text-white/90">
            <span className="text-muted text-xs mr-2">{questaoIdx + 1}/{questoes.length}</span>
            {q.enunciado}
          </p>

          <div className="flex flex-col gap-2 mb-6">
            {q.alternativas.map(alt => (
              <button key={alt.letra} onClick={() => setRespostaSel(alt.letra)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                  respostaSel === alt.letra
                    ? 'border-accent bg-accent/8 text-white'
                    : 'border-white/7 bg-surface2 text-muted hover:border-white/20 hover:text-white'
                }`}>
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-xs flex-shrink-0 ${respostaSel === alt.letra ? 'bg-accent text-bg' : 'bg-surface3'}`}>
                  {alt.letra}
                </span>
                {alt.texto}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => responderQuestao(false)} className="btn-secondary px-4 py-3 text-sm">Pular</button>
            <button onClick={() => responderQuestao(true)} disabled={!respostaSel}
              className="btn-primary flex-1 py-3 text-sm disabled:opacity-40">
              {questaoIdx + 1 >= questoes.length ? 'Finalizar prova →' : 'Próxima →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── RESULTADO ────────────────────────────────────────────────
  if (etapa === 'resultado' && resultado) {
    const valida = resultado.valida
    return (
      <div className="max-w-lg mx-auto animate-fade-up">
        <div className="card text-center">
          <div className="text-5xl mb-4">{valida ? '🏆' : '😕'}</div>
          <div className="font-display text-2xl font-bold mb-2">
            {valida ? 'Sessão Validada!' : 'Sessão Não Validada'}
          </div>
          <div className="text-muted text-sm mb-6">
            Você acertou{' '}
            <strong className={valida ? 'text-accent' : 'text-danger'}>
              {resultado.total_corretas} de {resultado.total_questoes}
            </strong>{' '}
            questões ({resultado.percentual_acerto}%)
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Tempo estudado', val: formatTempo(segundos), cor: 'text-accent' },
              { label: 'Acerto', val: `${resultado.percentual_acerto}%`, cor: valida ? 'text-accent2' : 'text-danger' },
              { label: 'Status', val: valida ? 'Válida' : 'Inválida', cor: valida ? 'text-accent' : 'text-danger' },
            ].map((item, i) => (
              <div key={i} className="bg-surface2 rounded-xl p-3">
                <div className={`font-display text-xl font-bold ${item.cor}`}>{item.val}</div>
                <div className="text-xs text-muted mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface2 border border-white/7 rounded-xl px-4 py-3 text-xs text-muted mb-6">
            📲 Seu responsável receberá um resumo desta sessão no WhatsApp.
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setEtapa('selecao'); setArea(null); setTopico(null); setSegundos(0) }}
              className="btn-secondary flex-1 py-3 text-sm">Nova sessão</button>
            <button onClick={() => router.push('/painel')} className="btn-primary flex-1 py-3 text-sm">
              Ir ao painel →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
