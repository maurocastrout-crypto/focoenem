// src/app/(responsavel)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SidebarResponsavel from '@/components/responsavel/SidebarResponsavel'

export default async function ResponsavelLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users').select('*').eq('id', user.id).single()

  if (profile?.role !== 'responsavel') redirect('/painel')

  // Verificar plano ativo
  if (!profile.plano_ativo && !new URL(process.env.NEXT_PUBLIC_APP_URL + '/responsavel/assinar').pathname) {
    // Permitir acesso à tela de assinatura mesmo sem plano
  }

  return (
    <div className="flex min-h-screen">
      <SidebarResponsavel user={profile} />
      <main className="flex-1 ml-60 p-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
