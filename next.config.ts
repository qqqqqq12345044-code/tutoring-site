import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 2026-09: "수업방식"(방문/화상) 구분을 사이트 구조에서 제거하면서
  // 기존에 노출됐을 수 있는 URL을 그대로 404로 두지 않고 상담 페이지로 안내.
  async redirects() {
    return [
      { source: "/lesson/visit", destination: "/consult", permanent: true },
      { source: "/lesson/online", destination: "/consult", permanent: true },
      { source: "/guide/choosing-visit-or-online", destination: "/guide", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
