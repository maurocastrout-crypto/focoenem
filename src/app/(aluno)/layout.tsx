// src/app/(aluno)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SidebarAluno from '@/components/aluno/SidebarAluno'

export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users').select('*').eq('id', user.id).single()

  if (profile?.role !== 'aluno') redirect('/responsavel/painel')

  return (
    <div className="flex min-h-screen">
      <SidebarAluno user={profile} />
      <main className="flex-1 ml-60 p-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
