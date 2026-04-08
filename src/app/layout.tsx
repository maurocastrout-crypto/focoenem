// src/app/layout.tsx
import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FocoENEM — Estudo Real. Resultado Real.',
  description: 'Plataforma inteligente de acompanhamento de estudos para o ENEM com monitoramento em tempo real para pais.',
  keywords: ['ENEM', 'estudo', 'vestibular', 'preparação', 'pais', 'monitoramento'],
  openGraph: {
    title: 'FocoENEM',
    description: 'Seu filho realmente estudou hoje?',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-bg text-white font-body antialiased">
        {children}
      </body>
    </html>
  )
}
