'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

const navItems = [
  { href: '/resp/painel',               label: 'Painel',        icon: '⊞' },
  { href: '/responsavel/relatorio',     label: 'Relatório',     icon: '📊' },
  { href: '/responsavel/configuracoes', label: 'Configurações', icon: '⚙️' },
]

export default function SidebarResponsavel({ user }: { user: User }) {
  const pathname = usePathname()
  const supabase = createClient()
  const iniciais = (user.nome[0] + user.sobrenome[0]).toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 bg-surface border-r border-white/7 flex flex-col z-50">
      <div className="flex items-center gap-2.5 px-6 py-7 border-b border-white/7">
        <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_#00e5a0]" />
        <span className="font-display font-bold text-lg tracking-tight">FocoENEM</span>
        <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5 ml-1">PAI</span>
      </div>
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ' + (active ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface2 hover:text-white')}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-5 border-t border-white/7">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-warn to-danger flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
            {iniciais}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.nome}</div>
            <div className="text-xs text-muted">Responsável</div>
          </div>
          <button onClick={handleLogout} className="text-muted hover:text-white transition-colors" title="Sair">⏏</button>
        </div>
      </div>
    </aside>
  )
}
