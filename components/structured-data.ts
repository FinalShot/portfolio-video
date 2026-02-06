export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jean Lanot',
    jobTitle: 'Monteur Vidéo',
    url: 'https://jeanlanot.com',
    sameAs: [
      // Ajoute tes réseaux sociaux
      'https://www.linkedin.com/in/jean-lanot',
      'https://www.instagram.com/jean_lanot/',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    knowsAbout: [
      'Montage vidéo',
      'monteur',
      'Post-production',
      'Adobe Premiere Pro',
      'After Effects',
      'DaVinci Resolve',
      'Final Cut Pro',
      'storytelling',
      'enquête',
      'documentaire',
      'bande-annonce',
      'fiction',
      'télévision',
      'youtube',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
