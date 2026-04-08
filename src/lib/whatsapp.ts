// src/lib/whatsapp.ts
// Integração com Z-API para envio de mensagens WhatsApp

import type { ResumoWhatsApp } from '@/types'
import { AREAS_ENEM } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const ZAPI_BASE = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}`

// ── Enviar mensagem de texto ────────────────────────────────────
export async function enviarMensagem(numero: string, mensagem: string): Promise<boolean> {
  try {
    // Formatar número: remover tudo que não é dígito, garantir +55
    const numeroFormatado = numero.replace(/\D/g, '')
    const numeroFinal = numeroFormatado.startsWith('55') ? numeroFormatado : `55${numeroFormatado}`

    const res = await fetch(`${ZAPI_BASE}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': process.env.ZAPI_CLIENT_TOKEN!,
      },
      body: JSON.stringify({
        phone: numeroFinal,
        message: mensagem,
      }),
    })

    return res.ok
  } catch (error) {
    console.error('[WhatsApp] Erro ao enviar mensagem:', error)
    return false
  }
}

// ── Notificação de início de sessão ────────────────────────────
export async function notificarInicioSessao(
  numero: string,
  nomeAluno: string,
  area: string,
  topico: string
): Promise<void> {
  const hora = format(new Date(), 'HH:mm', { locale: ptBR })
  const mensagem = [
    `📚 *FocoENEM — Alerta de Estudo*`,
    ``,
    `✅ *${nomeAluno}* iniciou uma sessão de estudo agora.`,
    ``,
    `📌 *Matéria:* ${area}`,
    `📖 *Tópico:* ${topico}`,
    `🕐 *Horário:* ${hora}`,
    ``,
    `O cronômetro está ativo e o estudo está sendo monitorado.`,
  ].join('\n')

  await enviarMensagem(numero, mensagem)
}

// ── Resumo diário completo ──────────────────────────────────────
export function gerarTextoResumo(resumo: ResumoWhatsApp): string {
  const data = format(new Date(resumo.data), "dd 'de' MMMM", { locale: ptBR })
  const horas = Math.floor(resumo.tempo_estudado_minutos / 60)
  const mins  = resumo.tempo_estudado_minutos % 60
  const tempoStr = horas > 0 ? `${horas}h ${mins}min` : `${mins}min`
  const pctMeta = Math.round((resumo.tempo_estudado_minutos / (resumo.meta_horas * 60)) * 100)

  const materiasTexto = resumo.materias_estudadas.map(m => {
    const area = AREAS_ENEM[m.area]
    const acertoStr = m.acerto !== null ? `— ${m.acerto}%` : ''
    const validoStr = m.valida ? '✅' : '❌'
    return `${validoStr} ${area.emoji} ${area.label} — ${m.duracao_minutos}min ${acertoStr}`
  }).join('\n')

  const dificuldadesTexto = resumo.topicos_com_dificuldade.length > 0
    ? resumo.topicos_com_dificuldade
        .map(t => `• ${t.topico} (${Math.round(t.tempo_medio_segundos / 60)}min/questão)`)
        .join('\n')
    : '• Nenhuma dificuldade significativa detectada'

  const alertasTexto = resumo.alertas_comportamento.length > 0
    ? resumo.alertas_comportamento
        .slice(0, 3)
        .map(a => {
          const tipos: Record<string, string> = {
            inatividade: '💤 Inatividade detectada',
            saiu_app: '📱 Saiu do app',
            troca_tela: '🔄 Trocas de tela frequentes',
            tela_parada: '⏸ Tela parada por muito tempo',
          }
          return `• ${tipos[a.tipo] || a.tipo}`
        }).join('\n')
    : '• Nenhum alerta comportamental'

  return [
    `📚 *FocoENEM — Resumo do dia*`,
    `👤 *Aluno:* ${resumo.aluno_nome}`,
    `📅 *Data:* ${data}`,
    ``,
    `⏱ *Tempo estudado:* ${tempoStr}`,
    `🎯 *Meta do dia:* ${resumo.meta_horas}h (${pctMeta}% concluída)`,
    `✅ *Sessões válidas:* ${resumo.sessoes_validas} de ${resumo.sessoes_validas + resumo.sessoes_invalidas}`,
    `📊 *Acerto médio:* ${resumo.acerto_medio}%`,
    ``,
    `📌 *Matérias estudadas:*`,
    materiasTexto,
    ``,
    `🔍 *Tópicos com dificuldade:*`,
    dificuldadesTexto,
    ``,
    `⚠️ *Alertas comportamentais:*`,
    alertasTexto,
    ``,
    `🔥 *Sequência atual:* ${resumo.streak} dias estudando!`,
    ``,
    `_FocoENEM • Estudo Real. Resultado Real._`,
  ].join('\n')
}

export async function enviarResumoDiario(numero: string, resumo: ResumoWhatsApp): Promise<void> {
  const texto = gerarTextoResumo(resumo)
  await enviarMensagem(numero, texto)
}
