import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { cookies, headers } from 'next/headers'
import './globals.css'
import { StructuredData } from '@/components/structured-data'
import { Inter } from 'next/font/google'
import { Ubuntu } from 'next/font/google'
import { LangProvider } from '@/lib/lang-context'
import type { Lang } from '@/lib/translations'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-ubuntu',
})

const siteUrl = "https://jeanlanot.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jean Lanot | Monteur vidéo',
    template: '%s | Jean Lanot'
  },
  description: "Monteur vidéo professionnel basé à Paris avec plus de 9 ans d'expérience. Spécialisé dans les pubs, documentaires, bandes-annonces et contenus broadcast pour chaînes de télévision, agences et productions.",
  keywords: ['monteur vidéo', 'éditeur vidéo', 'montage vidéo Paris', 'post-production', 'Jean Lanot', 'vidéo professionnelle', 'télévision', 'publicité', 'documentaire', 'adobe', 'premiere pro', 'after effects', 'montage', 'vidéo', 'animation', 'sous-titres', 'motion design', 'motion'],
  authors: [{ name: 'Jean Lanot' }],
  creator: 'Jean Lanot',
  publisher: 'Jean Lanot',
  generator: 'Next.js',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_US'],
    url: siteUrl,
    title: 'Jean Lanot | Monteur vidéo',
    description: 'Portfolio de montage vidéo - Pubs, documentaires, fictions',
    siteName: 'Jean Lanot Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jean Lanot - Monteur Vidéo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jean Lanot | Monteur vidéo',
    description: 'Portfolio de montage vidéo - Pubs, documentaires, fictions',
    images: ['/og-image.jpg'],
    creator: '@jeanlanot',
  },
  alternates: {
    canonical: 'https://jeanlanot.com',
    languages: {
      'fr': 'https://jeanlanot.com',
      'en': 'https://jeanlanot.com',
      'x-default': 'https://jeanlanot.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-light-512x512.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-512x512.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const headersList = await headers()

  const cookieLang = cookieStore.get('lang')?.value

  let lang: Lang = 'fr'

  if (cookieLang === 'fr' || cookieLang === 'en') {
    // Cookie présent → choix explicite de l'utilisateur, priorité absolue
    lang = cookieLang
  } else {
    // Première visite : on lit Accept-Language côté serveur
    // → la bonne langue est rendue dès le premier paint, sans flash
    const acceptLanguage = headersList.get('accept-language') ?? ''
    const primary = acceptLanguage.split(',')[0].slice(0, 2).toLowerCase()
    lang = primary === 'fr' ? 'fr' : 'en'
  }

  return (
    <html lang={lang} className={`${inter.variable} ${ubuntu.variable}`}>
      <body className="font-sans antialiased">
        <StructuredData />
        <LangProvider initialLang={lang}>
          {children}
        </LangProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
