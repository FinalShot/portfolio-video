/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      // YouTube
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      // Vimeo
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
      },
      // Instagram
      {
        protocol: "https",
        hostname: "instagram.com",
      },
      // Local
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
    // Optimisation avancée
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  swcMinify: true,
};

export default nextConfig;
