import type { NextConfig } from "next";

// Hosting en Vercel (render en servidor): las páginas de academias
// (/<slug>) se renderizan con datos del API. PostHog sigue conectándose
// directo a us.i.posthog.com (ver components/providers.tsx).
const nextConfig: NextConfig = {};

export default nextConfig;
