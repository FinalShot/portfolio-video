import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Ubuntu as V0_Font_Ubuntu } from "next/font/google";

const ubuntu = V0_Font_Ubuntu({ subsets: ["latin"], weight: ["300","400","500","700"] });

export const metadata: Metadata = {
  title: "Jean Lanot | Monteur Vidéo",
  description:
    "Monteur vidéo basé à Paris avec plus de 9 ans d'expérience. Travaillant avec des agences, des productions indépendantes ou des institutions.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-512x512.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-512x512.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Jean Lanot | Monteur Vidéo",
    description:
      "Portfolio de Jean Lanot, monteur vidéo basé à Paris. Publicités, fictions, émissions et documentaires.",
    url: "https://jeanlanot.com",
    siteName: "Jean Lanot Portfolio",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jean Lanot | Monteur Vidéo",
    description:
      "Portfolio de Jean Lanot, monteur vidéo basé à Paris.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${ubuntu.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
