// src/middleware.ts
// Roda em toda requisição — redireciona usuários não autenticados
// e garante que aluno não acessa área do responsável e vice-versa

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Rotas públicas — deixar passar sem checar
  const rotasPublicas = ['/', '/login', '/cadastro']
  if (rotasPublicas.includes(path)) {
    // Se já está logado, redirecionar para o painel correto
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'aluno') {
        return NextResponse.redirect(new URL('/painel', request.url))
      }
      if (profile?.role === 'responsavel') {
        return NextResponse.redirect(new URL('/responsavel/painel', request.url))
      }
    }
    return supabaseResponse
  }

  // Usuário não autenticado tentando acessar área protegida
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verificar role e redirecionar se necessário
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAlunoRoute = path.startsWith('/painel') || path.startsWith('/sessao') ||
    path.startsWith('/questoes') || path.startsWith('/progresso') ||
    path.startsWith('/historico') || path.startsWith('/perfil')

  const isResponsavelRoute = path.startsWith('/responsavel')

  if (isAlunoRoute && profile?.role !== 'aluno') {
    return NextResponse.redirect(new URL('/responsavel/painel', request.url))
  }

  if (isResponsavelRoute && profile?.role !== 'responsavel') {
    return NextResponse.redirect(new URL('/painel', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
