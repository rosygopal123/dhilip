import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "accelerometer=(self \"https://sketchfab.com\"), gyroscope=(self \"https://sketchfab.com\"), camera=(), microphone=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
