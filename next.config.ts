import type { NextConfig } from "next";

// Export estático para GitHub Pages: no hay servidor Node, así que PostHog
// se conecta directo a us.i.posthog.com (ver components/providers.tsx) en
// lugar del proxy /ingest que requería rewrites.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
