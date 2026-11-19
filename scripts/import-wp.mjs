#!/usr/bin/env node
// Imports everything public from the live WordPress/WooCommerce site (read-only, REST APIs, no login).
//
//   node scripts/import-wp.mjs              data + any missing images
//   node scripts/import-wp.mjs --no-images  data only
//   node scripts/import-wp.mjs --force      re-convert every image
//   node scripts/import-wp.mjs --uploads ~/Downloads/uploads
//                                           read images from a copy of wp-content/uploads instead of the web
//
// Writes to src/data/:
//   products.json    1 entry per product: style number, name, description, specs, categories, tags, photos
//   categories.json  product categories with their parent
//   pages.json       site pages: title, cleaned HTML, plain text, images (cart/checkout/account pages left out)
//   posts.json       blog posts
//   faqs.json        FAQ entries
//   portfolio.json   custom-work gallery items
//   redirects.json   old URL → new URL, served by next.config.mjs (entries marked live)
// and images to public/products/*.webp (product photos, 1200px; 600px card copies in public/products/card/) and public/content/** (page, blog and gallery images).
//
// The live site sits behind Cloudflare, which blocks fast bulk downloads. Images are fetched slowly, one at a
// time, and the run stops at the first block instead of retrying; wait a while and run it again, or use --uploads.
// Safe to re-run: images already on disk are skipped.

import { mkdir, writeFile, access, readFile, readdir, copyFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { categoryUrl } from '../src/lib/catalog-rules.mjs';

const SITE = 'https://diamondemotions.com';
const STORE = `${SITE}/wp-json/wc/store/v1`;
const WP = `${SITE}/wp-json/wp/v2`;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'src/data');
const PUBLIC = path.join(ROOT, 'public');
const PRODUCT_WIDTH = 1200; // product page gallery (the originals are 1200px)
const CARD_WIDTH = 600; // collection cards show ~300px wide; 600 covers 2x screens
// card-size copy of a product photo: /products/x.webp → /products/card/x.webp
const cardPath = (dest) => dest.replace(/^\/products\//, '/products/card/');
const CONTENT_WIDTH = 1600;
const DELAY_MS = 1500; // pause between image downloads

const argv = process.argv.slice(2);
const args = new Set(argv);
const withImages = !args.has('--no-images');
const force = args.has('--force');
const uploadsArg = argv[argv.indexOf('--uploads') + 1];
const uploadsDir = args.has('--uploads') && uploadsArg ? path.resolve(uploadsArg.replace(/^~(?=\/)/, os.homedir())) : null;

const UA = { 'User-Agent': 'Mozilla/5.0 (DiamondEmotions site import)' };

// WooCommerce/system pages that have no counterpart on the new site (archives is the theme's demo page)
const SKIP_PAGES = new Set(['cart', 'checkout', 'thank-you', 'view-order', 'my-account', 'products', 'archives']);

async function getJson(url, { withTotal = false } = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: UA });
    if (res.ok) {
      const body = await res.json();
      return withTotal ? { body, pages: Number(res.headers.get('x-wp-totalpages') ?? 1) } : body;
    }
    if (attempt >= 3) throw new Error(`${res.status} ${url}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
}

async function fetchAll(base, label) {
  const out = [];
  for (let page = 1; ; page++) {
    const { body, pages } = await getJson(`${base}${base.includes('?') ? '&' : '?'}per_page=100&page=${page}`, {
      withTotal: true,
    });
    out.push(...body);
    process.stdout.write(`\r  ${label}: ${out.length}`);
    if (body.length < 100 || page >= pages) break;
  }
  process.stdout.write('\n');
  return out;
}

// ---------- text and HTML cleanup ----------

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', '#038': '&', '#039': "'" };
const decode = (s = '') =>
  s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
    if (ENTITIES[e]) return ENTITIES[e];
    if (e[0] !== '#') return m;
    const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(n) ? String.fromCodePoint(n) : m;
  });

// the site's contact email: the old sales@ address becomes Rick's
const siteEmail = (s) => s.replace(/sales@diamondemotions\.com/gi, 'rick@diamondemotions.com');

const DROP_BLOCKS = /<(script|style|noscript|svg|form|iframe|template|button|select|textarea)\b[\s\S]*?<\/\1>/gi;

const text = (html = '') =>
  siteEmail(decode(
    html
      .replace(DROP_BLOCKS, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|h[1-6]|li|div|tr|blockquote)>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t ]+/g, ' ')
    .replace(/ ?\n[\s]*/g, '\n')
    .trim());

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? decode(m[2] ?? m[3] ?? '') : null;
};

const KEEP = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'a', 'strong', 'b', 'em', 'i', 'br', 'img', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td']);
const VOID = new Set(['br', 'img']);

const isUpload = (u) => /^https?:\/\/(www\.)?diamondemotions\.com\/wp-content\/uploads\//i.test(u);
// an uploads URL → its file on the new site, e.g. /content/2016/09/ring.webp
function contentPath(u) {
  const rel = decodeURIComponent(new URL(u).pathname.replace(/^\/wp-content\/uploads\//, ''));
  const ext = path.extname(rel).toLowerCase();
  const out = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? rel.slice(0, -ext.length) + '.webp' : rel;
  return `/content/${out}`;
}
// links back to the old site become paths on the new one
function localHref(href) {
  try {
    const u = new URL(href, SITE);
    if (u.hostname.replace(/^www\./, '') !== 'diamondemotions.com') return href;
    if (isUpload(u.href)) return contentPath(u.href);
    return u.pathname + u.search + u.hash;
  } catch {
    return href;
  }
}

// Keeps the readable structure of Avada's builder output (headings, paragraphs, lists, links, images, tables)
// and drops its layout wrappers, inline styles and scripts.
function clean(html, register) {
  const images = [];
  const out = siteEmail(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(DROP_BLOCKS, '')
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, name) => {
      name = name.toLowerCase();
      if (!KEEP.has(name)) return ' ';
      if (tag.startsWith('</')) return VOID.has(name) ? '' : `</${name}>`;
      if (name === 'img') {
        const src = [attr(tag, 'data-orig-src'), attr(tag, 'data-src'), attr(tag, 'src')].find(
          (s) => s && !s.startsWith('data:'),
        );
        if (!src || !isUpload(src)) return '';
        const local = register(src);
        images.push(local);
        return `<img src="${escapeAttr(local)}" alt="${escapeAttr(attr(tag, 'alt') ?? '')}">`;
      }
      if (name === 'a') {
        const href = attr(tag, 'href');
        if (href && isUpload(href)) register(href);
        return href && !href.startsWith('javascript:') ? `<a href="${escapeAttr(localHref(href))}">` : '<a>';
      }
      return `<${name}>`;
    })
    .replace(/[ \t\r\n ]+/g, ' ')
    .replace(/<(p|h[1-6]|li|strong|b|em|i|a|blockquote|td|th)>\s*<\/\1>/g, '')
    .replace(/<(ul|ol|tr|tbody|thead|table)>\s*<\/\1>/g, '')
    .replace(/\s*(<\/?(?:h[1-6]|p|ul|ol|li|blockquote|table|thead|tbody|tr)>)\s*/g, '$1')
    // Avada wraps whole blocks in <p>: unwrap a <p> that opens straight onto a block, and its stray </p>
    .replace(/<p>(?=<(?:h[1-6]|ul|ol|table|blockquote|p)>)/g, '')
    .replace(/(<\/(?:h[1-6]|ul|ol|table|blockquote)>)<\/p>/g, '$1')
    .replace(/<\/p><\/p>/g, '</p>')
    .trim();
  return { html: out, images: [...new Set(images)] };
}

const camel = (s) =>
  s
    .replace(/^No\. of /, 'Number of ')
    .replace(/[^A-Za-z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toLowerCase());

const pathOf = (url) => {
  try {
    return new URL(url).pathname;
  } catch {
    return null;
  }
};

// ---------- images ----------

const downloads = new Map(); // dest (public path) → { url, kind }
function registerProduct(url, file) {
  downloads.set(`/products/${file}`, { url, kind: 'product' });
  return `/products/${file}`;
}
function registerContent(url) {
  const dest = contentPath(url);
  if (!downloads.has(dest)) downloads.set(dest, { url, kind: 'content' });
  return dest;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class Blocked extends Error {}

// the original file, from the local uploads copy when given, otherwise from the site
async function source(url) {
  if (uploadsDir) {
    const rel = decodeURIComponent(new URL(url).pathname.replace(/^\/wp-content\/uploads\//, ''));
    try {
      return await readFile(path.join(uploadsDir, rel));
    } catch (e) {
      // original not in the copy: fall back to the largest size WordPress made of it (name-800x800.jpg …)
      const dir = path.join(uploadsDir, path.dirname(rel));
      const ext = path.extname(rel);
      const base = path.basename(rel, ext).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`^${base}(?:-scaled)?(?:-(\\d+)x(\\d+))?${ext.replace('.', '\\.')}$`, 'i');
      const sizes = (await readdir(dir).catch(() => []))
        .map((f) => ({ f, m: f.match(pattern) }))
        .filter((x) => x.m)
        .map((x) => ({ f: x.f, area: x.m[1] ? Number(x.m[1]) * Number(x.m[2]) : Infinity }))
        .sort((a, b) => b.area - a.area);
      if (sizes.length) return readFile(path.join(dir, sizes[0].f));
      // a resized copy (name-500x500.jpg, name-scaled-500x667.jpg) missing from a copy that has only
      // originals: use the original (name.jpg, or name-scaled.jpg)
      const m = rel.match(/^(.*?)(-scaled)?-\d+x\d+(\.[a-z]+)$/i);
      if (!m) throw e;
      for (const candidate of [`${m[1]}${m[2] ?? ''}${m[3]}`, `${m[1]}-scaled${m[3]}`, `${m[1]}${m[3]}`]) {
        try {
          return await readFile(path.join(uploadsDir, candidate));
        } catch {}
      }
      throw e;
    }
  }
  const res = await fetch(url, { headers: UA });
  if (res.status === 403 || res.status === 429) throw new Blocked(String(res.status));
  if (!res.ok) throw new Error(String(res.status));
  return Buffer.from(await res.arrayBuffer());
}

async function saveImages() {
  let fetched = 0;
  let skipped = 0;
  const failed = [];
  let n = 0;
  const list = [...downloads];
  for (const [dest, { url, kind }] of list) {
    n++;
    const file = path.join(PUBLIC, dest);
    const card = kind === 'product' ? path.join(PUBLIC, cardPath(dest)) : null;
    if (!force && (await exists(file)) && (!card || (await exists(card)))) {
      skipped++;
      continue;
    }
    try {
      await mkdir(path.dirname(file), { recursive: true });
      if (dest.endsWith('.webp')) {
        const width = kind === 'product' ? PRODUCT_WIDTH : CONTENT_WIDTH;
        const original = await source(url);
        const convert = (w) => {
          const img = sharp(original).rotate().resize({ width: w, height: w, fit: 'inside', withoutEnlargement: true });
          return (kind === 'product' ? img.flatten({ background: '#ffffff' }) : img).webp({ quality: 80 });
        };
        await convert(width).toFile(file);
        if (card) {
          await mkdir(path.dirname(card), { recursive: true });
          await convert(CARD_WIDTH).toFile(card);
        }
      } else if (uploadsDir) {
        const rel = decodeURIComponent(new URL(url).pathname.replace(/^\/wp-content\/uploads\//, ''));
        await copyFile(path.join(uploadsDir, rel), file);
      } else {
        await writeFile(file, await source(url));
      }
      fetched++;
    } catch (e) {
      if (e instanceof Blocked) {
        console.log(`\nThe site blocked the download (${e.message}) at ${n}/${list.length}. Stopping here;`);
        console.log('wait a while and run the script again (it resumes), or use --uploads with a copy of wp-content/uploads.');
        process.exitCode = 2;
        break;
      }
      failed.push(`${dest} ← ${url} (${e.code ?? e.message})`);
    }
    process.stdout.write(`\r  images: ${n}/${list.length}`);
    if (!uploadsDir) await sleep(DELAY_MS);
  }
  process.stdout.write('\n');
  const missing = list.length - skipped - fetched;
  console.log(`Images: ${fetched} new, ${skipped} already on disk, ${missing} still missing`);
  if (failed.length) {
    console.log(`${failed.length} images failed:\n  ${failed.join('\n  ')}`);
    process.exitCode ||= 1;
  }
}

// ---------- main ----------

async function main() {
  console.log(`Reading ${SITE} …`);
  const [rawCats, rawProducts, rawPages, rawPosts, rawFaqs, rawPortfolio, postCats, faqCats, portCats, portSkills, portTags] =
    await Promise.all([
      fetchAll(`${STORE}/products/categories`, 'product categories'),
      fetchAll(`${STORE}/products`, 'products'),
      fetchAll(`${WP}/pages`, 'pages'),
      fetchAll(`${WP}/posts`, 'posts'),
      fetchAll(`${WP}/avada_faq`, 'faqs'),
      fetchAll(`${WP}/avada_portfolio`, 'portfolio'),
      fetchAll(`${WP}/categories`, 'post categories'),
      fetchAll(`${WP}/faq_category`, 'faq categories').catch(() => []),
      fetchAll(`${WP}/portfolio_category`, 'portfolio categories').catch(() => []),
      fetchAll(`${WP}/portfolio_skills`, 'portfolio skills').catch(() => []),
      fetchAll(`${WP}/portfolio_tags`, 'portfolio tags').catch(() => []),
    ]);

  // featured images of posts and gallery items
  const mediaIds = [...new Set([...rawPosts, ...rawPortfolio].map((x) => x.featured_media).filter(Boolean))];
  const media = new Map();
  for (let i = 0; i < mediaIds.length; i += 100) {
    const batch = await getJson(`${WP}/media?per_page=100&include=${mediaIds.slice(i, i + 100).join(',')}`);
    for (const m of batch) media.set(m.id, { url: m.source_url, alt: text(m.alt_text) });
  }
  const featured = (id) => {
    const m = media.get(id);
    return m && isUpload(m.url) ? { src: registerContent(m.url), alt: m.alt } : null;
  };
  const names = (list) => (ids = []) => ids.map((id) => text(list.find((t) => t.id === id)?.name ?? String(id)));

  // product categories
  const catById = new Map(rawCats.map((c) => [c.id, c]));
  const categories = rawCats
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      name: text(c.name),
      parent: c.parent ? catById.get(c.parent)?.slug ?? null : null,
      count: c.count,
      description: text(c.description),
      image: c.image?.src && isUpload(c.image.src) ? registerContent(c.image.src) : null,
      oldUrl: c.permalink,
    }))
    .sort((a, b) => a.id - b.id);

  // products
  const products = rawProducts
    .map((p) => {
      const attributes = {};
      for (const a of p.attributes ?? []) {
        const values = a.terms.map((t) => text(t.name)).filter(Boolean);
        if (values.length) attributes[camel(text(a.name))] = values;
      }
      const images = (p.images ?? []).map((img, n) => ({
        src: registerProduct(img.src, `${p.slug}${n ? `__${n + 1}` : ''}.webp`),
        alt: text(img.alt),
      }));
      const short = text(p.short_description);
      const long = text(p.description);
      return {
        id: p.id,
        style: text(p.name).toUpperCase(),
        slug: p.slug,
        type: p.type,
        name: (short || long).split('\n')[0],
        description: long,
        categories: p.categories.map((c) => c.slug),
        tags: (p.tags ?? []).map((t) => text(t.name)),
        brands: (p.brands ?? []).map((b) => text(b.name)),
        attributes,
        images,
        oldUrl: p.permalink,
      };
    })
    .sort((a, b) => a.style.localeCompare(b.style, undefined, { numeric: true }));

  // pages
  const pageById = new Map(rawPages.map((p) => [p.id, p]));
  const pages = rawPages
    .filter((p) => !SKIP_PAGES.has(p.slug))
    .map((p) => {
      const { html, images } = clean(p.content.rendered, registerContent);
      return {
        id: p.id,
        slug: p.slug,
        title: text(p.title.rendered),
        parent: p.parent ? pageById.get(p.parent)?.slug ?? null : null,
        modified: p.modified,
        image: featured(p.featured_media),
        html,
        text: text(p.content.rendered),
        images,
        oldUrl: p.link,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  // blog posts
  const posts = rawPosts
    .map((p) => {
      const { html, images } = clean(p.content.rendered, registerContent);
      return {
        id: p.id,
        slug: p.slug,
        title: text(p.title.rendered),
        date: p.date,
        modified: p.modified,
        excerpt: text(p.excerpt.rendered),
        categories: names(postCats)(p.categories),
        image: featured(p.featured_media),
        html,
        text: text(p.content.rendered),
        images,
        oldUrl: p.link,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // FAQs
  const faqs = rawFaqs
    .map((f) => ({
      id: f.id,
      question: text(f.title.rendered),
      answer: clean(f.content.rendered, registerContent).html,
      answerText: text(f.content.rendered),
      categories: names(faqCats)(f.faq_category),
      order: f.menu_order ?? 0,
    }))
    .sort((a, b) => a.order - b.order || a.id - b.id);

  // custom-work gallery
  const portfolio = rawPortfolio
    .map((x) => ({
      id: x.id,
      slug: x.slug,
      title: text(x.title.rendered),
      date: x.date,
      image: featured(x.featured_media),
      text: text(x.content.rendered),
      categories: names(portCats)(x.portfolio_category),
      skills: names(portSkills)(x.portfolio_skills),
      tags: names(portTags)(x.portfolio_tags),
      oldUrl: x.link,
    }))
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));

  // ---------- redirects: old URL → new URL ----------
  // Product URLs (/product/<slug>/) and blog post URLs (/blog/<slug>/) are the same on the new site.
  // Categories follow src/lib/catalog-rules.mjs; a style category with no products goes to its department.
  const hasProducts = (slug) =>
    products.some((p) => p.categories.includes(slug) || p.categories.some((c) => categories.find((x) => x.slug === c)?.parent === slug));
  const DEPARTMENT_OF = { 'engagement-rings': '/bridal/', 'wedding-bands': '/wedding-bands/' };
  const PAGE_URL = {
    'engagement-rings': '/bridal/',
    'new-designs': '/new-arrivals/',
    'retailer-registration': '/become-a-retailer/',
    'store-locator': '/find-a-jeweler/',
    'marketing-banners': '/for-retailers/',
    testimonials: '/about/',
    'my-account': '/retailer-login/',
    'view-order': '/retailer-login/',
    cart: '/',
    checkout: '/',
    'thank-you': '/',
    products: '/bridal/',
    archives: '/blog/',
  };
  const redirects = [];
  const add = (from, to, kind) => {
    if (from && to && from !== to && !redirects.some((r) => r.from === from)) redirects.push({ from, to, live: true, kind });
  };
  for (const c of categories) {
    const url = categoryUrl(c);
    add(pathOf(c.oldUrl), url && (hasProducts(c.slug) ? url : DEPARTMENT_OF[c.parent] ?? url), 'category');
  }
  for (const p of rawPages) add(pathOf(p.link), PAGE_URL[p.slug] ?? null, 'page');
  for (const x of portfolio) add(pathOf(x.oldUrl), '/custom/', 'portfolio');
  add('/mens-bands/', '/wedding-bands/mens-bands/', 'page');

  // ---------- write ----------
  await mkdir(DATA_DIR, { recursive: true });
  const write = (name, data) => writeFile(path.join(DATA_DIR, name), JSON.stringify(data, null, 1) + '\n');
  await Promise.all([
    write('categories.json', categories),
    write('products.json', products),
    write('pages.json', pages),
    write('posts.json', posts),
    write('faqs.json', faqs),
    write('portfolio.json', portfolio),
    write('redirects.json', redirects),
  ]);
  console.log(
    `Wrote ${products.length} products, ${categories.length} categories, ${pages.length} pages, ${posts.length} posts, ` +
      `${faqs.length} FAQs, ${portfolio.length} gallery items, ${redirects.length} redirects ` +
      `(${redirects.filter((r) => r.live).length} live) to src/data/`,
  );
  const counts = [...downloads.values()].reduce((m, d) => ((m[d.kind] = (m[d.kind] ?? 0) + 1), m), {});
  console.log(`Images referenced: ${counts.product ?? 0} product photos, ${counts.content ?? 0} page/blog/gallery files`);

  if (withImages) await saveImages();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
