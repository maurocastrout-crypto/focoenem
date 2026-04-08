// src/app/api/whatsapp/resumo-diario/route.ts
// Chamada via cron job diário (Vercel Cron ou outro scheduler)
// Envia resumo para todos os responsáveis no horário configurado

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { enviarResumoDiario } from '@/lib/whatsapp'
import type { ResumoWhatsApp } from '@/types'
import { format } from 'date-fns'

// Esta rota é chamada a cada hora pelo cron job
// Filtra apenas os responsáveis cujo horario_resumo == hora atual
export async function POST(request: Request) {
  // Verificar autorização do cron (segurança)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const horaAtual = format(new Date(), 'HH:00') // ex: "20:00"

  // Buscar responsáveis que querem receber agora
  const { data: responsaveis } = await supabase
    .from('users')
    .select(`
      id, nome, whatsapp, horario_resumo, meta_horas_dia, minimo_acerto,
      aluno:aluno_id (
        id, nome, sobrenome
      )
    `)
    .eq('role', 'responsavel')
    .eq('horario_resumo', horaAtual)
    .eq('plano_ativo', true)

  if (!responsaveis?.length) {
    return NextResponse.json({ message: 'Nenhum envio agendado para agora', hora: horaAtual })
  }

  const hoje = format(new Date(), 'yyyy-MM-dd')
  const resultados = []

  for (const resp of responsaveis) {
    if (!resp.aluno) continue

    const alunoId = (resp.aluno as any).id
    const nomeAluno = `${(resp.aluno as any).nome} ${(resp.aluno as any).sobrenome}`

    // Buscar sessões de hoje do aluno
    const { data: sessoes } = await supabase
      .from('sessoes')
      .select(`*, mini_provas(*)`)
      .eq('aluno_id', alunoId)
      .gte('inicio', `${hoje}T00:00:00`)
      .lte('inicio', `${hoje}T23:59:59`)

    // Buscar alertas de hoje
    const { data: alertas } = await supabase
      .from('alertas_sessao')
      .select('*')
      .eq('aluno_id', alunoId)
      .gte('timestamp', `${hoje}T00:00:00`)

    // Buscar streak atual
    const { data: progresso } = await supabase
      .from('progresso_geral')
      .select('streak_atual')
      .eq('aluno_id', alunoId)
      .single()

    // Montar resumo
    const sessoesValidas   = sessoes?.filter(s => s.status === 'valida') ?? []
    const sessoesInvalidas = sessoes?.filter(s => s.status === 'invalida') ?? []

    const tempoTotal = sessoes?.reduce((acc, s) => acc + (s.duracao_segundos || 0), 0) ?? 0

    const acertos = sessoes
      ?.map(s => s.mini_provas?.[0]?.percentual_acerto)
      .filter(Boolean) as number[]
    const acertoMedio = acertos.length
      ? Math.round(acertos.reduce((a, b) => a + b, 0) / acertos.length)
      : 0

    // Tópicos com dificuldade (tempo médio alto)
    const topicosComDificuldade = sessoes
      ?.flatMap(s => s.mini_provas?.[0]?.respostas ?? [])
      .reduce((acc: any[], r: any) => {
        if (r.tempo_segundos > 120) { // mais de 2 min na questão
          const existing = acc.find(a => a.topico === r.topico)
          if (existing) {
            existing.tempos.push(r.tempo_segundos)
          } else {
            acc.push({ topico: r.topico || 'Geral', tempos: [r.tempo_segundos] })
          }
        }
        return acc
      }, [])
      .map((t: any) => ({
        topico: t.topico,
        tempo_medio_segundos: Math.round(t.tempos.reduce((a: number, b: number) => a + b, 0) / t.tempos.length),
      }))
      .slice(0, 3) ?? []

    const resumo: ResumoWhatsApp = {
      responsavel_id: resp.id,
      aluno_nome: nomeAluno,
      data: hoje,
      tempo_estudado_minutos: Math.round(tempoTotal / 60),
      meta_horas: resp.meta_horas_dia,
      sessoes_validas: sessoesValidas.length,
      sessoes_invalidas: sessoesInvalidas.length,
      acerto_medio: acertoMedio,
      materias_estudadas: (sessoes ?? []).map(s => ({
        area: s.area,
        topico: s.topico,
        duracao_minutos: Math.round((s.duracao_segundos || 0) / 60),
        acerto: s.mini_provas?.[0]?.percentual_acerto ?? null,
        valida: s.status === 'valida',
      })),
      alertas_comportamento: alertas ?? [],
      streak: progresso?.streak_atual ?? 0,
      topicos_com_dificuldade: topicosComDificuldade,
    }

    const enviado = await enviarResumoDiario(resp.whatsapp, resumo)
    resultados.push({ responsavel_id: resp.id, enviado })
  }

  return NextResponse.json({ message: 'Resumos enviados', resultados })
}
