 /** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Allow all subdomains of unsplash for gallery images
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
    // Optimize images for mobile devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable AVIF format for better compression on mobile
    formats: ['image/avif', 'image/webp'],
  },
  // Output configuration for better deployment
  output: 'standalone',
};

module.exports = nextConfig;
