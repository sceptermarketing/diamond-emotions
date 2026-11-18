import type { MetadataRoute } from 'next';
import { SITE_URL } from './sitemap';

// Until launch (SITE_INDEXABLE not 'true') the site is noindex: crawlers may still fetch pages, so they
// see the noindex header/tag and drop anything already indexed, but no sitemap is offered.
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.SITE_INDEXABLE === 'true';
  return indexable
    ? { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: { userAgent: '*', allow: '/' } };
}
