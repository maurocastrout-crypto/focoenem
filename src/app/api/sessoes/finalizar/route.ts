// src/app/api/sessoes/finalizar/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { notificarInicioSessao } from '@/lib/whatsapp'
import { AREAS_ENEM } from '@/types'

// POST /api/sessoes/finalizar
// Recebe as respostas da mini-prova, calcula acerto, valida sessão
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const { sessao_id, respostas } = body
  // respostas: [{ questao_id, resposta_escolhida, tempo_segundos }]

  // Buscar questões para calcular acerto
  const questaoIds = respostas.map((r: any) => r.questao_id).filter(Boolean)
  const { data: questoes } = await supabase
    .from('questoes').select('id, resposta_correta, topico').in('id', questaoIds)

  // Calcular resultado de cada questão
  const respostasProcessadas = respostas.map((r: any) => {
    const questao = questoes?.find(q => q.id === r.questao_id)
    const resultado = !questao || !r.resposta_escolhida
      ? 'pulada'
      : r.resposta_escolhida === questao.resposta_correta
        ? 'correta' : 'errada'
    return { ...r, resultado, topico: questao?.topico }
  })

  const totalQuestoes  = respostasProcessadas.length
  const totalCorretas  = respostasProcessadas.filter((r: any) => r.resultado === 'correta').length
  const percentualAcerto = Math.round((totalCorretas / totalQuestoes) * 100)
  const tempoTotal     = respostasProcessadas.reduce((acc: number, r: any) => acc + (r.tempo_segundos || 0), 0)

  // Buscar mínimo de acerto do responsável
  const { data: responsavel } = await supabase
    .from('users').select('minimo_acerto').eq('aluno_id', user.id).eq('role', 'responsavel').single()
  const minimoAcerto = responsavel?.minimo_acerto ?? 60
  const valida = percentualAcerto >= minimoAcerto

  // Salvar mini-prova (o trigger do banco atualiza o progresso automaticamente)
  const { data: miniProva, error } = await supabase
    .from('mini_provas')
    .insert({
      sessao_id,
      aluno_id: user.id,
      respostas: respostasProcessadas,
      total_questoes: totalQuestoes,
      total_corretas: totalCorretas,
      percentual_acerto: percentualAcerto,
      tempo_total_segundos: tempoTotal,
      valida,
    })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    mini_prova: miniProva,
    valida,
    percentual_acerto: percentualAcerto,
    total_corretas: totalCorretas,
    total_questoes: totalQuestoes,
  })
}

// POST /api/sessoes/iniciar
// Notifica o responsável via WhatsApp quando sessão começa
export async function PUT(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { area, topico } = await request.json()

  // Buscar nome do aluno e WhatsApp do responsável
  const { data: aluno } = await supabase
    .from('users').select('nome, sobrenome').eq('id', user.id).single()

  const { data: responsavel } = await supabase
    .from('users').select('whatsapp').eq('aluno_id', user.id).eq('role', 'responsavel').single()

  if (responsavel?.whatsapp && aluno) {
    const nomeAluno = `${aluno.nome} ${aluno.sobrenome}`
    const areaLabel = AREAS_ENEM[area as keyof typeof AREAS_ENEM]?.label ?? area
    await notificarInicioSessao(responsavel.whatsapp, nomeAluno, areaLabel, topico)
  }

  return NextResponse.json({ ok: true })
}
