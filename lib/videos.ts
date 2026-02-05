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

export const videos: Video[] = [
  {
    id: "1",
    title: "Mountain Escape",
    category: "EMISSIONS & DOCS",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "TravelVlog",
    year: 2025,
    aspectRatio: "landscape",
    publishedAt: Date,
  },
  {
    id: "2",
    title: "City Lights",
    category: "FICTIONS",
    thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=600&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "Indie Film Co",
    year: 2024,
    aspectRatio: "portrait",
    publishedAt: Date,
  },
  {
    id: "3",
    title: "Tech Launch",
    category: "PUBS & BRAND CONTENT",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "TechCorp",
    year: 2025,
    aspectRatio: "landscape",
    publishedAt: Date,
  },
  {
    id: "4",
    title: "Ocean Dreams",
    category: "FICTIONS",
    thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "Wave Studios",
    year: 2024,
    aspectRatio: "square",
    publishedAt: Date,
  },
  {
    id: "5",
    title: "Brand Story",
    category: "PUBS & BRAND CONTENT",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "Luxury Brand",
    year: 2025,
    aspectRatio: "portrait",
    publishedAt: Date,
  },
  {
    id: "6",
    title: "Gaming Montage",
    category: "EMISSIONS & DOCS",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "ProGamer",
    year: 2024,
    aspectRatio: "landscape",
    publishedAt: Date,
  },
  {
    id: "7",
    title: "Product Showcase",
    category: "PUBS & BRAND CONTENT",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "Retail Giant",
    year: 2025,
    aspectRatio: "square",
    publishedAt: Date,
  },
  {
    id: "8",
    title: "Documentary Short",
    category: "FICTIONS",
    thumbnail: "https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "Documentary Films",
    year: 2024,
    aspectRatio: "landscape",
    publishedAt: Date,
  },
  {
    id: "9",
    title: "Podcast Highlights",
    category: "EMISSIONS & DOCS",
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=600&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "The Talk Show",
    year: 2025,
    aspectRatio: "portrait",
      publishedAt: Date,
  },
  {
    id: "10",
    title: "Fashion Film",
    category: "PUBS & BRAND CONTENT",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "Fashion House",
    year: 2024,
    aspectRatio: "landscape",
      publishedAt: Date,
  },
  {
    id: "11",
    title: "Music Video",
    category: "FICTIONS",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "Record Label",
    year: 2025,
    aspectRatio: "square",
      publishedAt: Date,
  },
  {
    id: "12",
    title: "Travel Series",
    category: "EMISSIONS & DOCS",
    thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    client: "Wanderlust",
    year: 2024,
    aspectRatio: "landscape",
      publishedAt: Date,
  },
];

export const categories: { value: VideoCategory; label: string }[] = [
  { value: "all", label: "TOUT" },
  { value: "EMISSIONS & DOCS", label: "EMISSIONS & DOCS" },
  { value: "PUBS & BRAND CONTENT", label: "PUBS & BRAND CONTENT" },
  { value: "BANDES-ANNONCES", label: "BANDES-ANNONCES" },
  { value: "FICTIONS", label: "FICTIONS" },
];
