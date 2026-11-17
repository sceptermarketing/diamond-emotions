import type { MetadataRoute } from 'next';
import { SITE_URL } from './sitemap';

export default function robots(): MetadataRoute.Robots {
  // staging/preview deployments stay out of search results until launch
  const live = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true;
  return live
    ? { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: { userAgent: '*', disallow: '/' } };
}
