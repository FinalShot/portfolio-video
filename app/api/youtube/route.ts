import { NextResponse, NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import type { Video } from "@/lib/videos";

const YOUTUBE_PLAYLIST_IDS: Record<string, string> = {
  "PUBS & BRAND CONTENT": "PLikZKcR_ooRCVFgNcJ-f8GDN-rO8HYM0F",
  "EMISSIONS & DOCS":     "PLikZKcR_ooRAYr18pyDSFHFhBUUN9kQOf",
  "BANDES-ANNONCES":      "PLikZKcR_ooRBcDzII69qz11FoZOk5-Lh8",
  FICTIONS:               "PLikZKcR_ooRBvbYlqu2rHz4-oge2Qps4a",
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

async function fetchPlaylist(
  categoryName: string,
  playlistId: string,
  apiKey: string
): Promise<Video[]> {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), {
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
  } catch (error) {
    console.error(`Error fetching ${categoryName}:`, error);
    return [];
  }
}

// Cette route reste disponible comme endpoint de refresh/fallback.
// Le fetch principal est désormais dans app/page.tsx (Server Component).
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const isAllowed = rateLimit(ip, 10, 60 * 1000);

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans quelques instants." },
        { status: 429 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error("YouTube API key not configured");
      return NextResponse.json(
        { error: "Erreur lors du chargement des vidéos." },
        { status: 500 }
      );
    }

    const results = await Promise.all(
      Object.entries(YOUTUBE_PLAYLIST_IDS).map(([cat, id]) =>
        fetchPlaylist(cat, id, apiKey)
      )
    );

    // Tri unique — une seule fois ici, plus de double tri
    const allVideos = results.flat().sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json(
      { videos: allVideos },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des vidéos." },
      { status: 500 }
    );
  }
}
