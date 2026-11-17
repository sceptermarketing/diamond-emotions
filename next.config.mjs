import { readFileSync } from 'node:fs';

// Old WordPress URLs → new pages (src/data/redirects.json, made by scripts/import-wp.mjs).
// Only entries whose new page exists are marked live; the rest switch on as pages get built.
const oldUrls = JSON.parse(readFileSync(new URL('./src/data/redirects.json', import.meta.url), 'utf8'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return oldUrls
      .filter((r) => r.live)
      .map((r) => ({ source: r.from, destination: r.to, permanent: true }));
  },
};

export default nextConfig;
