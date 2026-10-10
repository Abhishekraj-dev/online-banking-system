import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy everything else under /api to Tomcat, EXCEPT /api/auth which NextAuth needs
      {
        source: '/api/:path((?!auth/).*)',
        destination: 'http://localhost:8081/api/:path*', 
      },
      // However, our custom Java login is at /api/auth/login, so we should map that specifically:
      {
        source: '/api/java/auth/login',
        destination: 'http://localhost:8081/api/auth/login',
      }
    ];
  },
};

export default nextConfig;
