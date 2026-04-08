// src/app/api/questoes/mini-prova/route.ts
// Retorna N questões aleatórias de uma área/tópico para a mini-prova

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const area    = searchParams.get('area')
  const topico  = searchParams.get('topico')
  const qtd     = parseInt(searchParams.get('qtd') ?? '8')

  if (!area) return NextResponse.json({ error: 'Área obrigatória' }, { status: 400 })

  // Buscar questões da área/tópico, priorizando as que o aluno errou antes (revisão espaçada)
  let query = supabase
    .from('questoes')
    .select('id, enunciado, alternativas, area, topico, dificuldade')
    .eq('area', area)
    .eq('ativo', true)

  if (topico) query = query.eq('topico', topico)

  const { data: questoes, error } = await query.limit(qtd * 3) // pegar mais para embaralhar

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Embaralhar e pegar apenas a quantidade solicitada
  const embaralhadas = (questoes ?? [])
    .sort(() => Math.random() - 0.5)
    .slice(0, qtd)

  return NextResponse.json({ questoes: embaralhadas })
}
