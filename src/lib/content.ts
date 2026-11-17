// Page, blog and gallery content imported from the live WordPress site (src/data/*.json, made by
// scripts/import-wp.mjs). Server only. The HTML was cleaned at import (Avada layout wrappers, scripts and
// styles removed); this file tidies what is left for display.

import { existsSync } from 'node:fs';
import path from 'node:path';
import rawPages from '@/data/pages.json';
import rawPosts from '@/data/posts.json';
import rawPortfolio from '@/data/portfolio.json';

type Image = { src: string; alt: string } | null;
type Page = { slug: string; title: string; html: string; text: string; image: Image };
type Post = Page & { date: string; excerpt: string; categories: string[] };
type GalleryItem = { slug: string; title: string; image: Image; categories: string[] };

const onDisk = (src: string) => existsSync(path.join(process.cwd(), 'public', decodeURI(src)));

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s(/-])([a-z])/g, (_, a, b) => a + b.toUpperCase()) : s;

/** Display-ready HTML: drops images not downloaded yet, theme leftovers and links to the old theme's anchors */
export function tidy(html: string) {
  return (
    html
      // images still to be downloaded
      .replace(/<img src="([^"]+)"[^>]*>/g, (tag, src) => (onDisk(src) ? tag.replace('<img ', '<img loading="lazy" ') : ''))
      // links to images that open in the old lightbox: keep the image, drop the link
      .replace(/<a href="\/content\/[^"]+">([\s\S]*?)<\/a>/g, '$1')
      // author bylines and timestamps from the theme's accordion
      .replace(/<a href="\/author\/[^"]*">[^<]*<\/a>\s*\d{4}-\d\d-\d\dT[\d:+-]+/g, '')
      // nested old category URLs (/product-category/a/b/) → /product-category/b/, which redirects to its new page
      .replace(/href="\/product-category\/(?:[^"/]+\/)+([^"/]+)\/"/g, 'href="/product-category/$1/"')
      // in-page anchors whose targets the old theme generated: keep the text
      .replace(/<a href="\/?#[^"]*">([\s\S]*?)<\/a>/g, '$1')
      .replace(/<a>([\s\S]*?)<\/a>/g, '$1')
      .replace(/<(strong|b|em|i)>\s*(<br>)?\s*<\/\1>/g, '')
      .replace(/<p>\s*(<br>\s*)*<\/p>/g, '')
      .replace(/<(h[1-6])>\s*<\/\1>/g, '')
  );
}

// headings become <h2 id> so a page can list its sections
function sections(html: string, level: string) {
  const toc: { id: string; title: string }[] = [];
  const out = html.replace(new RegExp(`<${level}>([\\s\\S]*?)</${level}>`, 'g'), (_, inner: string) => {
    const title = titleCase(inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    if (!title) return '';
    const id = slugify(title);
    toc.push({ id, title });
    return `<h2 id="${id}">${title}</h2>`;
  });
  return { html: out, toc };
}

const pages = rawPages as Page[];

export function getPage(slug: string) {
  const p = pages.find((x) => x.slug === slug);
  if (!p) throw new Error(`No imported page "${slug}"`);
  return p;
}

/** Page body without its own <h1> (the page intro shows the title) */
export function pageHtml(slug: string) {
  return tidy(getPage(slug).html.replace(/<h1>[\s\S]*?<\/h1>/, ''));
}

/** Education: the old page opened with an accordion index of the sections below it; keep the sections */
export function educationContent() {
  const html = getPage('education').html;
  const intro = html.match(/<h4>([\s\S]*?)<\/h4>/)?.[1] ?? '';
  // the index ends with the Birthstones list; the articles start after it
  const start = html.indexOf('</ul>', html.indexOf('Birthstones </a></h4>'));
  const body = tidy(start > 0 ? html.slice(start + 5) : html)
    .replace(/<h4>\s*<strong>([\s\S]*?)<\/strong>[\s\S]*?<\/h4>/g, '<h4>$1</h4>')
    .replace(/<h3>/g, '<h4>')
    .replace(/<\/h3>/g, '</h4>');
  // month names under Birthstones stay small headings
  const marked = body.replace(/<h4>(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)<\/h4>/g, (_, m) => `<h3>${titleCase(m)}</h3>`);
  const { html: withIds, toc } = sections(marked, 'h4');
  return { intro: titleCase(intro.replace(/<[^>]+>/g, '').trim()).replace(/\. ([a-z])/g, (_, c) => `. ${c.toUpperCase()}`), html: withIds, toc };
}

// ---------- blog ----------

export const POSTS = (rawPosts as Post[]).map((p) => ({
  ...p,
  image: p.image && onDisk(p.image.src) ? p.image : null,
  html: tidy(p.html),
  href: `/blog/${p.slug}/`,
}));

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

// ---------- custom work gallery ----------

const CATEGORY_LABEL = (c: string) => titleCase(c);

export const GALLERY = (rawPortfolio as GalleryItem[]).map((g) => ({
  slug: g.slug,
  title: g.title,
  image: g.image && onDisk(g.image.src) ? g.image.src : null,
  categories: g.categories.map(CATEGORY_LABEL),
}));

export const GALLERY_CATEGORIES = [...new Set(GALLERY.flatMap((g) => g.categories))].sort();
