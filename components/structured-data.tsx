// Server Component — pas de "use client"
export function StructuredData() {
  const siteUrl = "https://jeanlanot.com";

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jean Lanot",
    jobTitle: "Monteur Vidéo",
    url: siteUrl,
    sameAs: [
      "https://www.linkedin.com/in/jean-lanot",
      "https://www.instagram.com/jean_lanot/",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
    knowsAbout: [
      "Montage vidéo",
      "Post-production",
      "Adobe Premiere Pro",
      "After Effects",
      "DaVinci Resolve",
      "Final Cut Pro",
      "Motion design",
      "Documentaire",
      "Bande-annonce",
      "Fiction",
      "Télévision",
    ],
  };

  // ← WebSite schema : active la SearchAction dans Google et améliore le knowledge panel
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jean Lanot Portfolio",
    url: siteUrl,
    inLanguage: ["fr", "en"],
    author: { "@type": "Person", name: "Jean Lanot" },
  };

  // ← CreativeWork : décrit le portfolio comme une œuvre professionnelle
  const portfolioLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Portfolio — Jean Lanot Monteur Vidéo",
    url: siteUrl,
    creator: { "@type": "Person", name: "Jean Lanot" },
    description:
      "Portfolio de montage vidéo professionnel : publicités, documentaires, bandes-annonces et fictions.",
    keywords:
      "montage vidéo, post-production, publicité, documentaire, bande-annonce, fiction",
    inLanguage: ["fr", "en"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioLd) }}
      />
    </>
  );
}
