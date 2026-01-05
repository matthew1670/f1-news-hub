import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.motorsport.com" },
      { protocol: "https", hostname: "www.formula1.com" },
      { protocol: "https", hostname: "media.formula1.com" },
      { protocol: "https", hostname: "www.the-race.com" },
      { protocol: "https", hostname: "www.racefans.net" },
      { protocol: "https", hostname: "www.fia.com" },
      { protocol: "https", hostname: "*.racer.com" },
      { protocol: "https", hostname: "f1tcdn.net" },
      { protocol: "https", hostname: "www.kymillman.com" },
      { protocol: "https", hostname: "sportsbase.io" },
    ],
  },
};

export default nextConfig;
