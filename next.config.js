/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfiguracja środowiska
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  },
  // Wyłączamy strict mode dla development
  reactStrictMode: false,
  // Konfiguracja obrazów
  images: {
    domains: ['localhost'], // Usunięte domeny zewnętrzne
  },
  // Konfiguracja dla Docker
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig