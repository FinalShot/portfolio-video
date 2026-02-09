/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  
    images: {
      formats: ['image/avif', 'image/webp'], // Formats modernes en priorité
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 31536000, // Cache d'1 an pour les images optimisées
    },
  
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
