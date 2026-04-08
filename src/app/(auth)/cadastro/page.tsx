'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types'

export default function CadastroPage() {
  const [role, setRole]         = useState<UserRole>('aluno')
  const [nome, setNome]         = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [email, setEmail]       = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [senha, setSenha]       = useState('')
  const [erro, setErro]         = useState('')
  const [loading, setLoading]   = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, sobrenome, whatsapp, role }
      }
    })

    if (error) {
      setErro(error.message === 'User already registered'
        ? 'Este e-mail já está cadastrado.'
        : 'Erro ao criar conta. Tente novamente.')
      setLoading(false)
      return
    }

    // Redirecionar para o painel correto
    if (role === 'responsavel') {
      router.push('/responsavel/painel')
    } else {
      router.push('/painel')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_#00e5a0]" />
          <span className="font-display font-bold text-xl tracking-tight">FocoENEM</span>
        </div>

        <div className="card">
          <h1 className="font-display text-2xl font-bold mb-1">Criar sua conta</h1>
          <p className="text-muted text-sm mb-6">Quem vai usar a plataforma?</p>

          {/* Seleção de role */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['aluno', 'responsavel'] as UserRole[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                  role === r
                    ? 'border-accent bg-accent/6 text-white'
                    : 'border-white/7 bg-surface2 text-muted hover:text-white'
                }`}
              >
                <div className="text-2xl mb-1.5">{r === 'aluno' ? '🎓' : '👨‍👩‍👦'}</div>
                {r === 'aluno' ? 'Sou o aluno' : 'Sou responsável'}
              </button>
            ))}
          </div>

          <form onSubmit={handleCadastro} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">Nome</label>
                <input className="input-base" type="text" placeholder="João" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">Sobrenome</label>
                <input className="input-base" type="text" placeholder="Silva" value={sobrenome} onChange={e => setSobrenome(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">E-mail</label>
              <input className="input-base" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">WhatsApp</label>
              <input className="input-base" type="tel" placeholder="(11) 99999-9999" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">Senha</label>
              <input className="input-base" type="password" placeholder="Mínimo 8 caracteres" value={senha} onChange={e => setSenha(e.target.value)} minLength={8} required />
            </div>

            {erro && (
              <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">{erro}</div>
            )}

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta →'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            Já tem conta?{' '}
            <Link href="/login" className="text-accent hover:underline font-medium">Entrar</Link>
          </div>

          <div className="mt-4 flex items-center gap-2 bg-accent/5 border border-accent/10 rounded-lg px-3 py-2.5 text-xs text-muted">
            <span>🔒</span>
            R$ 49,90/mês. Cancele quando quiser. Sem taxa de cancelamento.
          </div>
        </div>
      </div>
    </div>
  )
}
