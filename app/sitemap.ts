import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jeanlanot.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      // ← hreflang dans le sitemap : aide Google à identifier les variantes linguistiques
      // Next.js 14+ supporte alternates dans le sitemap
      alternates: {
        languages: {
          fr: baseUrl,
          en: baseUrl,
        },
      },
    },
  ]
}
