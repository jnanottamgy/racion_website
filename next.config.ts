import type { NextConfig } from "next";

/**
 * Static export, opt-in.
 *
 * Every route in this site prerenders — there are no API routes, no server
 * actions and nothing request-dependent — so it can be built either as a Next
 * application or as a directory of plain files that any static host will serve.
 *
 * It stays opt-in rather than becoming the default because the two builds are
 * not equivalent. On a Node host, `next/image` resizes each photograph to the
 * viewport asking for it; exported, it cannot, and every device gets the full
 * file. That is a real cost on a phone and worth keeping wherever the optimiser
 * is available.
 *
 *   STATIC_EXPORT=true pnpm build   → ./out, hostable anywhere
 *   pnpm build                      → a Next build, images optimised
 */
const staticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(staticExport
    ? { output: "export" as const, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
