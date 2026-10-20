import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The demo serves everything from an in-memory store seeded at boot, so every
  // page renders at request time. Cache Components would demand Suspense
  // boundaries around that dynamic data for no benefit here.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
