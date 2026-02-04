import { NextResponse } from "next/server";

const PLAYLIST_IDS: Record<string, string> = {
  "PUBS & BRAND CONTENT": "PLikZKcR_ooRCVFgNcJ-f8GDN-rO8HYM0F",
  "EMISSIONS & DOCS": "PLikZKcR_ooRAYr18pyDSFHFhBUUN9kQOf",
  "BANDES-ANNONCES": "PLikZKcR_ooRBcDzII69qz11FoZOk5-Lh8",
  "FICTIONS": "PLikZKcR_ooRBvbYlqu2rHz4-oge2Qps4a"
};

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API key not configured" },
      { status: 500 }
    );
  }

  try {
    const allVideos: Array<{
      id: string;
      title: string;
      thumbnail: string;
      link: string;
      realPublishDate: string;
      autoCategory: string;
      source: string;
    }> = [];

    const promises = Object.entries(PLAYLIST_IDS).map(async ([categoryName, playlistId]) => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
      );
      const data = await res.json();
      
      if (data.items) {
        return data.items.map((item: {
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
          thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url,
          link: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
          realPublishDate: item.contentDetails.videoPublishedAt,
          autoCategory: categoryName,
          source: "youtube"
        }));
      }
      return [];
    });

    const results = await Promise.all(promises);
    allVideos.push(...results.flat());

    // Tri par date
    allVideos.sort((a, b) => new Date(b.realPublishDate).getTime() - new Date(a.realPublishDate).getTime());

    return NextResponse.json({ videos: allVideos });
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
