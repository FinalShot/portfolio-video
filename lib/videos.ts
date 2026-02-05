export type VideoCategory = "all" | "TOUT" | "PUBS & BRAND CONTENT" | "EMISSIONS & DOCS" | "BANDES-ANNONCES" | "FICTIONS";

export interface Video {
  id: string;
  title: string;
  category: Exclude<VideoCategory, "all">;
  thumbnail: string;
  youtubeId: string;
  videoUrl?: string;
  client?: string;
  year: number;
  aspectRatio: "landscape" | "portrait" | "square";
  description?: string;
  duration?: string;
  publishedAt: Date;
}

export const categories: { value: VideoCategory; label: string }[] = [
  { value: "all", label: "TOUT" },
  { value: "EMISSIONS & DOCS", label: "EMISSIONS & DOCS" },
  { value: "PUBS & BRAND CONTENT", label: "PUBS & BRAND CONTENT" },
  { value: "BANDES-ANNONCES", label: "BANDES-ANNONCES" },
  { value: "FICTIONS", label: "FICTIONS" },
];
