import { NextResponse, NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const PLAYLIST_IDS: Record<string, string> = {
  "PUBS & BRAND CONTENT": "PLikZKcR_ooRCVFgNcJ-f8GDN-rO8HYM0F",
  "EMISSIONS & DOCS": "PLikZKcR_ooRAYr18pyDSFHFhBUUN9kQOf",
  "BANDES-ANNONCES": "PLikZKcR_ooRBcDzII69qz11FoZOk5-Lh8",
  FICTIONS: "PLikZKcR_ooRBvbYlqu2rHz4-oge2Qps4a",
};

interface CacheEntry {
  data: Array<{
    id: string;
    title: string;
    thumbnail: string;
    link: string;
    realPublishDate: string;
    autoCategory: string;
    source: string;
  }>;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const isAllowed = rateLimit(ip, 10, 60 * 1000);

    if (!isAllowed) {
      return NextResponse.json(
        {
          error:
            "Trop de requêtes. Veuillez réessayer dans quelques instants.",
        },
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

    const cacheKey = "youtube_videos";
    const now = Date.now();

    if (
      cache[cacheKey] &&
      now - cache[cacheKey].timestamp < CACHE_DURATION
    ) {
      console.log("📦 Serving videos from cache");
      return NextResponse.json({ videos: cache[cacheKey].data });
    }

    console.log("🔄 Fetching videos from YouTube API");

    const allVideos: Array<{
      id: string;
      title: string;
      thumbnail: string;
      link: string;
      realPublishDate: string;
      autoCategory: string;
      source: string;
    }> = [];

    const promises = Object.entries(PLAYLIST_IDS).map(
      async ([categoryName, playlistId]) => {
        try {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
          );

          if (!res.ok) {
            console.error(
              `YouTube API error for ${categoryName}:`,
              res.statusText
            );
            return [];
          }

          const data = await res.json();

          if (data.items) {
            return data.items.map(
              (item: {
                snippet: {
                  resourceId: { videoId: string };
                  title: string;
                  thumbnails?: {
                    maxres?: { url: string };
                    high?: { url: string };
                  };
                };
                contentDetails: {
                  videoPublishedAt: string;
                };
              }) => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                thumbnail:
                  item.snippet.thumbnails?.maxres?.url ||
                  item.snippet.thumbnails?.high?.url ||
                  "",
                link: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                realPublishDate: item.contentDetails.videoPublishedAt,
                autoCategory: categoryName,
                source: "youtube",
              })
            );
          }

          return [];
        } catch (error) {
          console.error(`Error fetching ${categoryName}:`, error);
          return [];
        }
      }
    );

    const results = await Promise.all(promises);
    allVideos.push(...results.flat());

    allVideos.sort(
      (a, b) =>
        new Date(b.realPublishDate).getTime() -
        new Date(a.realPublishDate).getTime()
    );

    cache[cacheKey] = {
      data: allVideos,
      timestamp: now,
    };

    return NextResponse.json({ videos: allVideos });
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des vidéos." },
      { status: 500 }
    );
  }
}
