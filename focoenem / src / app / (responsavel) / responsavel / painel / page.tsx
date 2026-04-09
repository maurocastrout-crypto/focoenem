(responsavel)/responsavel/painel/page.tsx
import { createClient } from '@/lib/supabase/server'
import { AREAS_ENEM, type AreaENEM } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import PainelResponsavelClient from './PainelResponsavelClient'

export default async function PainelResponsavelPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: responsavel } = await supabase
    .from('users').select('*').eq('id', user!.id).single()

  const alunoId = responsavel?.aluno_id
  if (!alunoId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-4xl mb-4">👨‍👩‍👦</div>
        <h2 className="font-display text-xl font-bold mb-2">Vincule uma conta de aluno</h2>
        <p className="text-muted text-sm max-w-sm">Compartilhe o código de convite com seu filho para conectar as contas.</p>
      </div>
    )
  }

  const { data: aluno } = await supabase.from('users').select('*').eq('id', alunoId).single()
  const { data: progresso } = await supabase.from('progresso_geral').select('*').eq('aluno_id', alunoId).single()
  const { data: progressoAreas } = await supabase.from('progresso_areas').select('*').eq('aluno_id', alunoId)

  const hoje = format(new Date(), 'yyyy-MM-dd')
  const { data: sessoesHoje } = await supabase
    .from('sessoes').select('*, mini_provas(*)')
    .eq('aluno_id', alunoId)
    .gte('inicio', `${hoje}T00:00:00`)
    .order('inicio', { ascending: false })

  const { data: alertasHoje } = await supabase
    .from('alertas_sessao').select('*')
    .eq('aluno_id', alunoId)
    .gte('timestamp', `${hoje}T00:00:00`)
    .order('timestamp', { ascending: false })

  // Sessão ativa agora
  const sessaoAtiva = sessoesHoje?.find(s => s.status === 'em_andamento' || s.status === 'pausada')

  // Métricas do dia
  const tempoHoje   = sessoesHoje?.reduce((acc, s) => acc + (s.duracao_segundos || 0), 0) ?? 0
  const hh          = Math.floor(tempoHoje / 3600)
  const mm          = Math.floor((tempoHoje % 3600) / 60)
  const tempoStr    = hh > 0 ? `${hh}h ${mm}m` : `${mm}m`
  const metaHoras   = responsavel?.meta_horas_dia ?? 3
  const pctMeta     = Math.min(Math.round((tempoHoje / 3600 / metaHoras) * 100), 100)

  const provasHoje  = sessoesHoje?.map(s => s.mini_provas?.[0]).filter(Boolean) ?? []
  const acertoMedio = provasHoje.length
    ? Math.round(provasHoje.reduce((acc: number, p: any) => acc + p.percentual_acerto, 0) / provasHoje.length)
    : 0

  const validas     = sessoesHoje?.filter(s => s.status === 'valida').length ?? 0
  const invalidas   = sessoesHoje?.filter(s => s.status === 'invalida').length ?? 0

  // Análise de tempo por questão (última sessão válida)
  const ultimaProva = provasHoje[0] as any
  const respostasAnalisadas = ultimaProva?.respostas
    ? (ultimaProva.respostas as any[]).map((r: any, i: number) => ({
        num: i + 1,
        topico: r.topico || 'Geral',
        resultado: r.resultado,
        tempo: r.tempo_segundos || 0,
      })).sort((a: any, b: any) => b.tempo - a.tempo)
    : []

  return (
    <PainelResponsavelClient
      responsavel={responsavel}
      aluno={aluno}
      progresso={progresso}
      progressoAreas={progressoAreas ?? []}
      sessoesHoje={sessoesHoje ?? []}
      alertasHoje={alertasHoje ?? []}
      sessaoAtiva={sessaoAtiva ?? null}
      tempoStr={tempoStr}
      pctMeta={pctMeta}
      metaHoras={metaHoras}
      acertoMedio={acertoMedio}
      validas={validas}
      invalidas={invalidas}
      respostasAnalisadas={respostasAnalisadas}
      alunoId={alunoId}
    />
  )
}
