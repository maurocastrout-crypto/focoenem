'use client'
// src/app/(responsavel)/configuracoes/page.tsx

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const HORARIOS = ['18:00','19:00','20:00','21:00','22:00','23:00']

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const [metaHoras,      setMetaHoras]     = useState(3)
  const [minimoAcerto,   setMinimoAcerto]  = useState(60)
  const [horarioResumo,  setHorarioResumo] = useState('20:00')
  const [whatsapp,       setWhatsapp]      = useState('')
  const [salvando,       setSalvando]      = useState(false)
  const [salvo,          setSalvo]         = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (data) {
        setMetaHoras(data.meta_horas_dia ?? 3)
        setMinimoAcerto(data.minimo_acerto ?? 60)
        setHorarioResumo(data.horario_resumo ?? '20:00')
        setWhatsapp(data.whatsapp ?? '')
      }
    }
    load()
  }, [supabase])

  async function salvar() {
    setSalvando(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('users').update({
      meta_horas_dia: metaHoras,
      minimo_acerto: minimoAcerto,
      horario_resumo: horarioResumo,
      whatsapp,
    }).eq('id', user!.id)
    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  // Preview da mensagem WhatsApp
  const previewWpp = [
    `📚 *FocoENEM — Resumo do dia*`,
    `👤 *Aluno:* Seu filho`,
    ``,
    `⏱ *Tempo estudado:* 2h 30min`,
    `🎯 *Meta do dia:* ${metaHoras}h`,
    `✅ *Sessões válidas:* 2 de 3`,
    `📊 *Acerto médio:* 76%`,
    ``,
    `📌 *Matérias estudadas:*`,
    `✅ 📐 Matemática — 1h 20min — 80%`,
    `✅ 🌍 C. Humanas — 1h 10min — 72%`,
    `❌ 🔬 Física — 45min — não validada`,
    ``,
    `⚠️ *Atenção:* Dificuldade em Funções Inversas`,
    ``,
    `🔥 *Sequência:* 8 dias estudando!`,
  ].join('\n')

  return (
    <div className="max-w-3xl animate-fade-up">
      <h1 className="font-display text-2xl font-bold mb-1">Configurações</h1>
      <p className="text-muted text-sm mb-8">Personalize as metas e notificações do seu filho</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Metas */}
        <div className="card">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">⚙ Metas do filho</div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Meta diária de horas</div>
                <div className="text-xs text-muted mt-0.5">Mínimo de horas válidas por dia</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMetaHoras(h => Math.max(1, h - 1))}
                  className="w-8 h-8 rounded-lg bg-surface2 border border-white/7 flex items-center justify-center hover:bg-surface3 transition-colors">−</button>
                <span className="font-display font-bold text-accent text-lg w-10 text-center">{metaHoras}h</span>
                <button onClick={() => setMetaHoras(h => Math.min(8, h + 1))}
                  className="w-8 h-8 rounded-lg bg-surface2 border border-white/7 flex items-center justify-center hover:bg-surface3 transition-colors">+</button>
              </div>
            </div>

            <div className="border-t border-white/7 pt-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Mínimo de acerto na mini-prova</div>
                <div className="text-xs text-muted mt-0.5">% mínimo para sessão ser válida</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMinimoAcerto(p => Math.max(40, p - 5))}
                  className="w-8 h-8 rounded-lg bg-surface2 border border-white/7 flex items-center justify-center hover:bg-surface3 transition-colors">−</button>
                <span className="font-display font-bold text-accent2 text-lg w-12 text-center">{minimoAcerto}%</span>
                <button onClick={() => setMinimoAcerto(p => Math.min(100, p + 5))}
                  className="w-8 h-8 rounded-lg bg-surface2 border border-white/7 flex items-center justify-center hover:bg-surface3 transition-colors">+</button>
              </div>
            </div>

            <div className="border-t border-white/7 pt-5">
              <div className="text-sm font-medium mb-3">Horário do resumo no WhatsApp</div>
              <div className="grid grid-cols-3 gap-2">
                {HORARIOS.map(h => (
                  <button key={h} onClick={() => setHorarioResumo(h)}
                    className={`py-2 rounded-xl text-sm font-display font-bold transition-all ${horarioResumo === h ? 'bg-accent text-bg' : 'bg-surface2 text-muted border border-white/7 hover:text-white'}`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/7 pt-5">
              <div className="text-sm font-medium mb-1.5">Número do WhatsApp</div>
              <input
                className="input-base"
                type="tel"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
              />
            </div>

            <button onClick={salvar} disabled={salvando}
              className="btn-primary w-full py-3 mt-1">
              {salvando ? 'Salvando...' : salvo ? '✓ Configurações salvas!' : 'Salvar configurações'}
            </button>
          </div>
        </div>

        {/* Preview WhatsApp */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.06), rgba(0,102,255,0.04))', borderColor: 'rgba(37,211,102,0.15)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#25d366]/15 flex items-center justify-center text-xl">📲</div>
            <div>
              <div className="font-display font-bold text-sm">Preview do resumo no WhatsApp</div>
              <div className="text-xs text-muted mt-0.5">Você receberá assim todo dia às <strong className="text-[#25d366]">{horarioResumo}</strong></div>
            </div>
          </div>
          <div className="bg-surface2 rounded-xl p-4 border-l-4 border-[#25d366] text-xs leading-loose text-muted whitespace-pre-line font-mono">
            {previewWpp}
          </div>
        </div>
      </div>
    </div>
  )
}
