'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

const navItems = [
  { href: '/painel',    label: 'Painel',           icon: '⊞' },
  { href: '/sessao',    label: 'Sessão de Estudo',  icon: '⏱' },
  { href: '/questoes',  label: 'Questões',          icon: '📚' },
  { href: '/progresso', label: 'Progresso',         icon: '📈' },
  { href: '/historico', label: 'Histórico',         icon: '📋' },
  { href: '/perfil',    label: 'Perfil',            icon: '👤' },
]

export default function SidebarAluno({ user }: { user: User }) {
  const pathname = usePathname()
  const supabase = createClient()

  const iniciais = `${user.nome[0]}${user.sobrenome[0]}`.toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 bg-surface border-r border-white/7 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-7 border-b border-white/7">
        <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_#00e5a0]" />
        <span className="font-display font-bold text-lg tracking-tight">FocoENEM</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:bg-surface2 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-5 border-t border-white/7">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
            {iniciais}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.nome} {user.sobrenome}</div>
            <div className="text-xs text-muted">Aluno</div>
          </div>
          <button onClick={handleLogout} className="text-muted hover:text-white transition-colors text-xs" title="Sair">
            ⏏
          </button>
        </div>
      </div>
    </aside>
  )
}
