import { readFileSync } from 'node:fs';

// Old WordPress URLs → new pages (src/data/redirects.json, made by scripts/import-wp.mjs).
// Only entries whose new page exists are marked live; the rest switch on as pages get built.
const oldUrls = JSON.parse(readFileSync(new URL('./src/data/redirects.json', import.meta.url), 'utf8'));

// Search engines are kept out until launch: every response says noindex. Set SITE_INDEXABLE=true
// (Vercel → Settings → Environment Variables, then redeploy) when the site goes live on its domain.
const indexable = process.env.SITE_INDEXABLE === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async headers() {
    return indexable ? [] : [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
  async redirects() {
    return oldUrls
      .filter((r) => r.live)
      .map((r) => ({ source: r.from, destination: r.to, permanent: true }));
  },
};

export default nextConfig;
