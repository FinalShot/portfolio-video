// Server Component — pas de "use client"
// Les vidéos YouTube sont fetchées ici, incluses dans le HTML initial → zéro spinner
import { PortfolioClient } from "./portfolio-client";
import type { Video } from "@/lib/videos";

const YOUTUBE_PLAYLIST_IDS: Record<string, string> = {
  "PUBS & BRAND CONTENT": "PLikZKcR_ooRCVFgNcJ-f8GDN-rO8HYM0F",
  "EMISSIONS & DOCS":     "PLikZKcR_ooRAYr18pyDSFHFhBUUN9kQOf",
  "BANDES-ANNONCES":      "PLikZKcR_ooRBcDzII69qz11FoZOk5-Lh8",
  "FICTIONS":             "PLikZKcR_ooRBvbYlqu2rHz4-oge2Qps4a",
};

type PlaylistItem = {
  snippet: {
    resourceId: { videoId: string };
    title: string;
    thumbnails?: {
      maxres?: { url: string };
      high?: { url: string };
    };
  };
  contentDetails: { videoPublishedAt: string };
};

const EXTERNAL_VIDEOS = [
  
    {
      title: "M6 - Le Meilleur Pâtissier",
      thumbnailUrl: "/thumbnails/LMP.jpg",
      videoUrl: "https://www.instagram.com/reels/DaS3RQAxnbC/",
      category: "BANDES-ANNONCES" as const,
      date: "2026-07-02",
    },

  {
    title: "Marie Jo Lingerie – Paris",
    thumbnailUrl: "/thumbnails/marie-jo.jpg",
    videoUrl: "https://www.instagram.com/reels/DV5wdySiJWf/",
    category: "PUBS & BRAND CONTENT" as const,
    date: "2026-03-15",
  },
  {
    title: "TF1 - Kev Adams Le Before",
    thumbnailUrl: "https://vumbnail.com/881022565.jpg",
    videoUrl: "https://vimeo.com/881022565",
    category: "FICTIONS" as const,
    date: "2023-11-03",
  },
  {
    title: "Olympic Museum",
    thumbnailUrl: "/thumbnails/olympic-museum.jpeg",
    videoUrl: "https://www.instagram.com/reels/C-dJ5BoszI9/",
    category: "PUBS & BRAND CONTENT" as const,
    date: "2024-08-09",
  },
  {
    title: "Audi France - e-tron endurance experience",
    thumbnailUrl: "/thumbnails/audi.jpg",
    videoUrl: "https://www.instagram.com/reels/C6_fS-cNv5Y/",
    category: "PUBS & BRAND CONTENT" as const,
    date: "2024-05-15",
  },
  {
    title: "NMA x Amazon Music",
    thumbnailUrl: "/thumbnails/nmaxamazonmusic.jpg",
    videoUrl: "https://www.instagram.com/reels/ClUEmThgfi-/",
    category: "PUBS & BRAND CONTENT" as const,
    date: "2022-11-23",
  },
{
  title: "PSG x ALL",
  thumbnailUrl: "/thumbnails/PSGxALL.jpeg",
  videoUrl: "https://www.instagram.com/reels/DHYwrt1vUa3/",
  category: "PUBS & BRAND CONTENT" as const,
  date: "2025-03-19",
},
    {
      title: "PSG x Yassir - Désiré Doué",
      thumbnailUrl: "/thumbnails/YASSIRxPSG.jpeg",
      videoUrl: "https://www.instagram.com/reels/DKuDGmltyLF/",
      category: "PUBS & BRAND CONTENT" as const,
      date: "2025-06-10",
    },
    {
      title: "PSG x Visit Qatar - Paint me if you can",
      thumbnailUrl: "/thumbnails/PSGxVQ.jpeg",
      videoUrl: "https://www.instagram.com/reels/DLkjLk9tydR/",
      category: "PUBS & BRAND CONTENT" as const,
      date: "2025-07-01",
    },
  {
    title: "Air Caraïbes",
    thumbnailUrl: "/thumbnails/aircaraibes.jpg",
    videoUrl: "https://www.instagram.com/reels/DSQSfXVEUmW/",
    category: "PUBS & BRAND CONTENT" as const,
    date: "2025-12-14",
  },
];

async function getYoutubeVideos(): Promise<Video[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YouTube API key not configured");
    return [];
  }

  try {
    const results = await Promise.all(
      Object.entries(YOUTUBE_PLAYLIST_IDS).map(async ([categoryName, playlistId]) => {
        const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
        url.searchParams.set("part", "snippet,contentDetails");
        url.searchParams.set("maxResults", "50");
        url.searchParams.set("playlistId", playlistId);
        url.searchParams.set("key", apiKey);

        const res = await fetch(url.toString(), {
          // Cache Next.js natif : revalide toutes les heures côté serveur
          // Fonctionne entre les instances serverless (Data Cache Vercel)
          next: { revalidate: 3600 },
        });

        if (!res.ok) {
          console.error(`YouTube API error for ${categoryName}:`, res.statusText);
          return [];
        }

        const data = await res.json();
        if (!data.items) return [];

        return data.items.map((item: PlaylistItem): Video => {
          const publishDate = new Date(item.contentDetails.videoPublishedAt);
          return {
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            category: categoryName as Video["category"],
            thumbnail:
              item.snippet.thumbnails?.maxres?.url ||
              item.snippet.thumbnails?.high?.url ||
              "",
            youtubeId: item.snippet.resourceId.videoId,
            year: publishDate.getFullYear(),
            publishedAt: publishDate,
            aspectRatio: "landscape",
            description: item.snippet.title,
          };
        });
      })
    );

    return results.flat();
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}

export default async function Page() {
  // Fetch exécuté côté serveur au moment du rendu de la page
  // → Les vidéos sont dans le HTML initial, pas de requête client
  const youtubeVideos = await getYoutubeVideos();

  const externalVideos: Video[] = EXTERNAL_VIDEOS.map((vid) => ({
    id: vid.videoUrl,
    title: vid.title,
    category: vid.category,
    thumbnail: vid.thumbnailUrl,
    youtubeId: "",
    videoUrl: vid.videoUrl,
    year: new Date(vid.date).getFullYear(),
    publishedAt: new Date(vid.date),
    aspectRatio: "landscape" as const,
  }));

  // Tri unique ici, une seule fois au moment du build/request serveur
  const allVideos = [...youtubeVideos, ...externalVideos].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return <PortfolioClient initialVideos={allVideos} />;
}
