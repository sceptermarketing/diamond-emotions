import type { MetadataRoute } from 'next';
import { CATALOG_URLS } from '@/lib/catalog';
import { POSTS } from '@/lib/content';
import { LINKS } from '@/lib/links';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diamondemotions.com').replace(/\/$/, '');

const PAGES = [
  LINKS.home,
  LINKS.about,
  LINKS.history,
  LINKS.forRetailers,
  LINKS.becomeRetailer,
  LINKS.custom,
  LINKS.customProcess,
  LINKS.customOrder,
  LINKS.contact,
  LINKS.findJeweler,
  LINKS.blog,
  '/education/',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...new Set([...PAGES, ...CATALOG_URLS, ...POSTS.map((p) => p.href)])].map((path) => ({ url: `${SITE_URL}${path}` }));
}
