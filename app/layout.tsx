import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { cookies } from 'next/headers'
import './globals.css'
import { StructuredData } from '@/components/structured-data'
import { Inter } from 'next/font/google'
import { Ubuntu } from 'next/font/google'
import { LangProvider } from '@/lib/lang-context'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',   // ← ajout de variable pour pouvoir l'utiliser en CSS
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
    // locale dynamique gérée par la page elle-même si besoin
    locale: 'fr_FR',
    alternateLocale: ['en_US'],   // ← annonce la version EN à Facebook/OG
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
  // ← hreflang : indique à Google les deux versions linguistiques
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
  // ← Lecture du cookie côté serveur pour le lang dans <html lang="">
  // Aucun flash : la valeur est connue avant le premier paint.
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value === 'en' ? 'en' : 'fr'

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
