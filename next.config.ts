import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/panoramas/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
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
