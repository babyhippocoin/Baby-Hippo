import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  return {
    reactStrictMode: true,
    // Keep development chunks separate from production builds. Running
    // `next build` while the prototype is open must not corrupt the dev server.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-live" : ".next",
  };
}
