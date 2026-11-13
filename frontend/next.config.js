/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  // Only the release workflow sets NEXT_OUTPUT=standalone, which makes the
  // build a self-contained server (server.js). A normal `npm run build` is
  // unchanged.
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
};

module.exports = nextConfig;
