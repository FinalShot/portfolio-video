import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { StructuredData } from '@/components/structured-data'
import { Inter } from 'next/font/google'
import { Ubuntu } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // ⬅️ IMPORTANT : spécifier les poids
  display: 'swap',
  variable: '--font-ubuntu',
})

const siteUrl = "https://portfolio-video-psi.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jean Lanot | Monteur Vidéo Paris',
    template: '%s | Jean Lanot'
  },
  description: 'Monteur vidéo professionnel basé à Paris avec plus de 9 ans d\'expérience. Spécialisé dans les pubs, documentaires, bandes-annonces et contenus broadcast pour TF1, agences et productions.',
  keywords: ['monteur vidéo', 'éditeur vidéo', 'montage vidéo Paris', 'post-production', 'Jean Lanot', 'vidéo professionnelle', 'TF1', 'publicité', 'documentaire'],
  authors: [{ name: 'Jean Lanot' }],
  creator: 'Jean Lanot',
  publisher: 'Jean Lanot',
  generator: 'Next.js',
  
  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    title: 'Jean Lanot | Monteur Vidéo Paris',
    description: 'Portfolio de montage vidéo - Pubs, documentaires, fictions. Plus de 9 ans d\'expérience avec TF1, agences et productions.',
    siteName: 'Jean Lanot Portfolio',
    images: [
      {
        url: '${siteUrl}/og-image.jpg', // On va créer cette image
        width: 1200,
        height: 630,
        alt: 'Jean Lanot - Monteur Vidéo',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Jean Lanot | Monteur Vidéo Paris',
    description: 'Portfolio de montage vidéo professionnel',
    images: ['${siteUrl}/og-image.jpg'],
    creator: '@jeanlanot', // ← Change si tu as un Twitter
  },
  
  // Robots
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
  
  // Icons
  icons: {
    icon: [
      {
        url: '/icon-light-512x512.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-512x512.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  
  // Verification (Google Search Console)
  // verification: {
  //   google: 'ton-code-google-verification',
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.className} ${ubuntu.variable}`}>
      <body className={`font-sans antialiased`}>
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
