'use client'
// src/app/(aluno)/questoes/page.tsx
// Na prática esta é a página de ESTUDO — lista aulas e exibe os slides

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AREAS_ENEM, type AreaENEM } from '@/types'

interface Slide {
  tipo: 'capa' | 'conteudo' | 'formula' | 'exemplo' | 'exercicio' | 'resumo'
  titulo: string
  corpo?: string
  formula?: string
  dica?: string
  exercicio?: {
    enunciado: string
    alternativas: { letra: string; texto: string }[]
    resposta: string
    explicacao: string
  }
}

interface Aula {
  id: string
  area: string
  topico: string
  subtopico: string
  titulo: string
  duracao_estimada_min: number
  slides: Slide[]
}

export default function EstudoPage() {
  const supabase = createClient()
  const [areaSel, setAreaSel]   = useState<AreaENEM | null>(null)
  const [aulas, setAulas]       = useState<Aula[]>([])
  const [aulaSel, setAulaSel]   = useState<Aula | null>(null)
  const [slideIdx, setSlideIdx] = useState(0)
  const [respostaSel, setResp]  = useState<string | null>(null)
  const [mostrarResp, setMostrarResp] = useState(false)
  const [loading, setLoading]   = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!areaSel) return
    setLoading(true)
    supabase.from('aulas').select('*').eq('area', areaSel).order('ordem')
      .then(({ data }) => { setAulas(data ?? []); setLoading(false) })
  }, [areaSel, supabase])

  function abrirAula(aula: Aula) {
    setAulaSel(aula)
    setSlideIdx(0)
    setResp(null)
    setMostrarResp(false)
    slideRef.current?.scrollTo({ top: 0 })
  }

  function proximoSlide() {
    if (!aulaSel) return
    if (slideIdx < aulaSel.slides.length - 1) {
      setSlideIdx(i => i + 1)
      setResp(null)
      setMostrarResp(false)
      slideRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function slideAnterior() {
    if (slideIdx > 0) {
      setSlideIdx(i => i - 1)
      setResp(null)
      setMostrarResp(false)
      slideRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const slide = aulaSel?.slides[slideIdx]
  const pct   = aulaSel ? Math.round(((slideIdx + 1) / aulaSel.slides.length) * 100) : 0

  const corTipo: Record<string, string> = {
    capa:      'bg-gradient-to-br from-accent2/10 to-accent/10 border-accent/20',
    conteudo:  'bg-surface',
    formula:   'bg-gradient-to-br from-accent2/8 to-surface border-accent2/20',
    exemplo:   'bg-gradient-to-br from-warn/6 to-surface border-warn/15',
    exercicio: 'bg-gradient-to-br from-danger/6 to-surface border-danger/15',
    resumo:    'bg-gradient-to-br from-accent/8 to-surface border-accent/20',
  }

  const iconTipo: Record<string, string> = {
    capa: '📚', conteudo: '📖', formula: '🔢', exemplo: '✏️', exercicio: '🎯', resumo: '✅'
  }

  // ── LISTA DE AULAS ───────────────────────────────────────────
  if (!aulaSel) return (
    <div className="animate-fade-up">
      <h1 className="font-display text-2xl font-bold mb-1">Material de Estudo</h1>
      <p className="text-muted text-sm mb-8">Estude aqui dentro — slides, fórmulas, exemplos e exercícios</p>

      {/* Seleção de área */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {(Object.entries(AREAS_ENEM) as [AreaENEM, any][]).map(([key, val]) => (
          <button key={key} onClick={() => setAreaSel(key)}
            className={`p-4 rounded-xl border text-center transition-all ${areaSel === key ? 'border-accent bg-accent/6' : 'border-white/7 bg-surface hover:border-white/20'}`}>
            <div className="text-2xl mb-1.5">{val.emoji}</div>
            <div className="font-display font-bold text-xs">{val.label}</div>
          </button>
        ))}
      </div>

      {/* Lista de aulas */}
      {loading && <p className="text-muted text-sm">Carregando aulas...</p>}

      {!loading && areaSel && aulas.length === 0 && (
        <p className="text-muted text-sm">Nenhuma aula disponível para esta área ainda.</p>
      )}

      {!loading && aulas.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
            {AREAS_ENEM[areaSel!]?.label} — {aulas.length} aula{aulas.length > 1 ? 's' : ''} disponível{aulas.length > 1 ? 'is' : ''}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aulas.map(aula => (
              <button key={aula.id} onClick={() => abrirAula(aula)}
                className="card text-left hover:border-accent/30 hover:bg-surface2/80 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{AREAS_ENEM[aula.area as AreaENEM]?.emoji}</div>
                  <span className="text-xs text-muted bg-surface2 px-2 py-1 rounded-full">{aula.duracao_estimada_min} min</span>
                </div>
                <div className="font-display font-bold text-sm mb-1 group-hover:text-accent transition-colors">{aula.titulo}</div>
                <div className="text-xs text-muted">{aula.topico} · {aula.subtopico}</div>
                <div className="mt-3 text-xs text-muted">{aula.slides.length} slides</div>
                <div className="mt-3 btn-primary text-xs py-2 text-center w-full">Estudar agora →</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!areaSel && (
        <div className="text-center py-16 text-muted">
          <div className="text-4xl mb-3">👆</div>
          <p className="text-sm">Selecione uma área para ver as aulas disponíveis</p>
        </div>
      )}
    </div>
  )

  // ── VIEWER DE SLIDES ──────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setAulaSel(null)}
          className="text-muted hover:text-white transition-colors text-sm flex items-center gap-1.5">
          ← Voltar
        </button>
        <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent2 to-accent rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-muted font-display font-bold">{slideIdx + 1}/{aulaSel.slides.length}</span>
      </div>

      {/* Slide */}
      {slide && (
        <div ref={slideRef} className={`rounded-2xl border p-7 mb-5 min-h-80 ${corTipo[slide.tipo] || 'bg-surface'}`}>

          {/* Tipo badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">{iconTipo[slide.tipo]}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-muted">
              {slide.tipo === 'capa' ? 'Início' : slide.tipo === 'conteudo' ? 'Conteúdo' : slide.tipo === 'formula' ? 'Fórmula' : slide.tipo === 'exemplo' ? 'Exemplo' : slide.tipo === 'exercicio' ? 'Exercício' : 'Resumo'}
            </span>
          </div>

          {/* Título */}
          <h2 className="font-display text-xl font-bold mb-4">{slide.titulo}</h2>

          {/* Fórmula */}
          {slide.formula && (
            <div className="bg-surface border border-accent2/20 rounded-xl px-5 py-4 mb-4 font-mono text-accent2 text-base leading-relaxed whitespace-pre-line text-center">
              {slide.formula}
            </div>
          )}

          {/* Corpo HTML */}
          {slide.corpo && (
            <div className="text-sm leading-relaxed text-white/90 prose-custom"
              dangerouslySetInnerHTML={{ __html: slide.corpo
                .replace(/<table/g, '<table class="w-full text-sm border-collapse mb-3"')
                .replace(/<th/g, '<th class="text-left p-2 border-b border-white/10 text-xs font-bold text-muted uppercase"')
                .replace(/<td/g, '<td class="p-2 border-b border-white/5"')
                .replace(/<ul/g, '<ul class="list-disc pl-5 space-y-1.5 my-2"')
                .replace(/<ol/g, '<ol class="list-decimal pl-5 space-y-1.5 my-2"')
                .replace(/<li/g, '<li class="text-white/80"')
                .replace(/<p/g, '<p class="mb-2"')
                .replace(/<strong/g, '<strong class="text-white font-semibold"')
              }} />
          )}

          {/* Exercício */}
          {slide.tipo === 'exercicio' && slide.exercicio && (
            <div>
              <p className="text-sm leading-relaxed mb-4 text-white/90">{slide.exercicio.enunciado}</p>
              <div className="flex flex-col gap-2 mb-4">
                {slide.exercicio.alternativas.map(alt => {
                  const isSelected = respostaSel === alt.letra
                  const isCorrect  = mostrarResp && alt.letra === slide.exercicio!.resposta
                  const isWrong    = mostrarResp && isSelected && alt.letra !== slide.exercicio!.resposta
                  return (
                    <button key={alt.letra}
                      onClick={() => !mostrarResp && setResp(alt.letra)}
                      disabled={mostrarResp}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                        isCorrect ? 'border-accent bg-accent/10 text-accent' :
                        isWrong   ? 'border-danger bg-danger/10 text-danger' :
                        isSelected ? 'border-accent2 bg-accent2/10 text-white' :
                        'border-white/7 bg-surface2 text-muted hover:border-white/20 hover:text-white'
                      }`}>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-xs flex-shrink-0 ${
                        isCorrect ? 'bg-accent text-bg' :
                        isWrong   ? 'bg-danger text-white' :
                        isSelected ? 'bg-accent2 text-white' : 'bg-surface3'
                      }`}>{alt.letra}</span>
                      {alt.texto}
                    </button>
                  )
                })}
              </div>

              {!mostrarResp && respostaSel && (
                <button onClick={() => setMostrarResp(true)}
                  className="btn-primary w-full py-2.5 text-sm">
                  Confirmar resposta
                </button>
              )}

              {mostrarResp && (
                <div className={`rounded-xl px-4 py-3 text-sm mt-2 ${respostaSel === slide.exercicio.resposta ? 'bg-accent/8 border border-accent/20 text-accent' : 'bg-danger/8 border border-danger/20 text-danger'}`}>
                  <div className="font-bold mb-1">
                    {respostaSel === slide.exercicio.resposta ? '✓ Correto!' : '✗ Incorreto'}
                  </div>
                  <div className="text-white/80 text-xs leading-relaxed">{slide.exercicio.explicacao}</div>
                </div>
              )}
            </div>
          )}

          {/* Dica */}
          {slide.dica && (
            <div className="mt-4 flex items-start gap-2 bg-warn/6 border border-warn/15 rounded-lg px-3 py-2.5">
              <span className="text-warn text-sm flex-shrink-0">💡</span>
              <p className="text-xs text-warn/90 leading-relaxed">{slide.dica}</p>
            </div>
          )}
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center gap-3">
        <button onClick={slideAnterior} disabled={slideIdx === 0}
          className="btn-secondary px-5 py-3 text-sm disabled:opacity-30">
          ← Anterior
        </button>

        <div className="flex-1 text-center text-xs text-muted font-display">
          {aulaSel.titulo}
        </div>

        {slideIdx < aulaSel.slides.length - 1 ? (
          <button onClick={proximoSlide}
            className="btn-primary px-5 py-3 text-sm">
            Próximo →
          </button>
        ) : (
          <button onClick={() => setAulaSel(null)}
            className="btn-primary px-5 py-3 text-sm bg-accent">
            ✓ Concluir aula
          </button>
        )}
      </div>
    </div>
  )
}
