// Product catalogue imported from the live WordPress site by scripts/import-wp.mjs
// (src/data/*.json, photos in public/products). Server only: import it from pages, not client components.

import { existsSync } from 'node:fs';
import path from 'node:path';
import rawProducts from '@/data/products.json';
import rawCategories from '@/data/categories.json';
import rawPages from '@/data/pages.json';
import { FASHION_LINES, styleSlug, typeName, typeSlug } from './catalog-rules.mjs';
import type { CategoryTile, Collection, Crumb, Product, TilesByDepartment } from './collections';

type RawProduct = Omit<(typeof rawProducts)[number], 'attributes'> & { attributes: Record<string, string[] | undefined> };
type RawCategory = (typeof rawCategories)[number];

const products = rawProducts as RawProduct[];
const categories = rawCategories as RawCategory[];
const catBySlug = new Map(categories.map((c) => [c.slug, c]));

const HOME: Crumb = { label: 'Home', href: '/' };
const PRICING = 'Explore each design, then call our team with the style number for pricing and ordering.';

// ---------- products ----------

// photos still to be downloaded show the card's placeholder instead of a broken image
const onDisk = (src: string) => existsSync(path.join(process.cwd(), 'public', src));
const photosOf = (p: RawProduct) => p.images.filter((img) => onDisk(img.src));

// Card title: the product's own one-line name when it has one, otherwise built from its specs
function cardName(p: RawProduct, noun: string) {
  const first = p.name.split(/(?<=\.)\s/)[0].replace(/\.$/, '').trim();
  if (first && first.length <= 70 && !/^this (design|ring)/i.test(first)) return first;
  const setting = p.attributes.setting?.[0];
  const shape = p.attributes.stoneShape?.find((s) => s !== 'No Diamonds');
  if (setting && shape) return `${setting} Set ${shape} ${noun}`.trim();
  return noun || p.style;
}

function toProduct(p: RawProduct, noun: string, types: string[] = []): Product {
  const a = p.attributes;
  const photo = photosOf(p)[0];
  // cards use the 600px copy made by the importer, when it exists
  const card = photo && photo.src.replace(/^\/products\//, '/products/card/');
  return {
    slug: p.slug,
    href: `/product/${p.slug}/`,
    style: p.style,
    name: cardName(p, noun),
    image: card && onDisk(card) ? card : photo?.src ?? null,
    alt: photo?.alt || `${p.style} ${noun}`.trim(),
    stones: a.stoneType ?? [],
    shapes: (a.stoneShape ?? []).filter((s) => s !== 'No Diamonds'),
    settings: a.setting ?? [],
    types,
    metals: a.metalType ?? [],
    colors: a.metalColor ?? [],
  };
}

const inAny = (slugs: string[]) => products.filter((p) => p.categories.some((c) => slugs.includes(c)));
const childrenOf = (slug: string) => categories.filter((c) => c.parent === slug);


// ---------- departments ----------

type Department = {
  label: string;
  href: string;
  main: Collection;
  collections: Collection[];
  tiles: CategoryTile[];
  // fashion only: a page per product type within a line (/fashion/<line>/<type>/)
  types?: (Collection & { line: string })[];
};

function tile(c: Collection, image?: { image: string; contain?: boolean }): CategoryTile {
  return {
    slug: c.slug,
    label: c.crumbs[c.crumbs.length - 1].label,
    href: c.href,
    ...(image ?? { image: c.products.find((p) => p.image)?.image ?? c.heroImage, contain: true }),
  };
}

// Bridal and wedding bands: one page per style category that has products
function styleDepartment(opts: {
  label: string;
  href: string;
  root: string;
  also?: string[];
  title: string;
  noun: string;
  intro: string;
  heroImage: string;
  tileImages: Record<string, { image: string; contain?: boolean }>;
  tileOrder: string[];
  styleTitle: (name: string) => string;
}): Department {
  const crumb: Crumb = { label: opts.label, href: opts.href };
  const styles = childrenOf(opts.root)
    .map((c) => ({ c, items: inAny([c.slug]) }))
    .filter((x) => x.items.length > 0);

  const collections: Collection[] = styles.map(({ c, items }) => ({
    slug: styleSlug(c.slug),
    department: opts.label,
    href: `${opts.href}${styleSlug(c.slug)}/`,
    crumbs: [HOME, crumb, { label: c.name }],
    title: opts.styleTitle(c.name),
    intro: c.description || `Discover ${c.name.toLowerCase()} styles for your ${opts.label.toLowerCase()} collection. ${PRICING}`,
    heroImage: opts.heroImage,
    products: items.map((p) => toProduct(p, opts.noun)),
  }));

  const order = (slug: string) => {
    const i = opts.tileOrder.indexOf(slug);
    return i === -1 ? 99 : i;
  };
  const tiles = collections
    .map((c) => tile(c, opts.tileImages[c.slug]))
    .sort(
      (a, b) =>
        order(a.slug) - order(b.slug) ||
        collections.find((c) => c.slug === b.slug)!.products.length -
          collections.find((c) => c.slug === a.slug)!.products.length,
    );

  const main: Collection = {
    slug: '',
    department: opts.label,
    href: opts.href,
    crumbs: [HOME, { label: opts.label }],
    title: opts.title,
    intro: opts.intro,
    heroImage: opts.heroImage,
    products: inAny([opts.root, ...(opts.also ?? []), ...styles.map((x) => x.c.slug)]).map((p) => toProduct(p, opts.noun)),
  };
  return { label: opts.label, href: opts.href, main, collections, tiles };
}

const BRIDAL = styleDepartment({
  label: 'Bridal',
  href: '/bridal/',
  root: 'engagement-rings',
  also: ['bridal'],
  title: 'Engagement Rings',
  noun: 'Diamond Engagement Ring',
  intro: `Engagement rings in the styles couples ask for by name — classic, halo, solitaire, three-stone, vintage and more. ${PRICING}`,
  heroImage: '/images/collections/cathedral-hero.jpg',
  tileImages: {
    classic: { image: '/images/filters/classic.jpg' },
    halo: { image: '/images/filters/halo.jpg' },
    solitaire: { image: '/images/filters/solitaire.jpg' },
    cathedral: { image: '/images/filters/cathedral.jpg', contain: true },
    carved: { image: '/images/filters/carved.jpg' },
    vintage: { image: '/images/filters/vintage.jpg' },
    '3-stone': { image: '/images/ring-three-stone.jpg' },
    bypass: { image: '/images/ring-bypass.jpg' },
    fancy: { image: '/images/ring-fancy.jpg' },
    invisible: { image: '/images/ring-invisible.jpg' },
    'split-shank': { image: '/images/ring-split.jpg' },
    twist: { image: '/images/ring-twist.jpg' },
  },
  tileOrder: ['classic', 'halo', 'solitaire', 'cathedral', 'carved', 'vintage'],
  styleTitle: (name) => `${name} Engagement Rings`,
});

const WEDDING_BANDS = styleDepartment({
  label: 'Wedding Bands',
  href: '/wedding-bands/',
  root: 'wedding-bands',
  title: 'Wedding Bands',
  noun: 'Wedding Band',
  intro: `Wedding bands to complete every bridal set — diamond, fitted, curved, eternity and men's bands. ${PRICING}`,
  heroImage: '/images/hero.jpg',
  tileImages: { 'mens-bands': { image: '/images/ms-mens-bands.jpg' } },
  tileOrder: ['classic', 'diamond-bands', 'fitted', 'curved', 'mens-bands'],
  styleTitle: (name) => (/bands$/i.test(name) ? name.replace(/&#8217;|'/g, '’') : `${name} Wedding Bands`),
});

// Fashion: one page per line (Color Fashion, Sterling Silver…) plus every earring across the lines
const LINE_LABEL: Record<string, string> = {
  color: 'Color Fashion',
  fashion: 'Fashion Jewelry',
  'swarovski-crystal-collection': 'Swarovski Crystal',
};
const LINE_IMAGE: Record<string, string> = {
  'color-fashion': '/images/ms-color-fashion.jpg',
  'sterling-silver': '/images/ms-sterling-silver.jpg',
  'diamond-fashion': '/images/ms-diamond-fashion.jpg',
  earrings: '/images/ms-earrings.jpg',
};

const FASHION: Department = (() => {
  const crumb: Crumb = { label: 'Fashion', href: '/fashion/' };
  const lines = Object.entries(FASHION_LINES)
    .map(([wp, slug]) => {
      const cat = catBySlug.get(wp);
      const label = LINE_LABEL[wp] ?? cat?.name ?? wp;
      const kids = childrenOf(wp);
      const items = inAny([wp, ...kids.map((k) => k.slug)]);
      return { wp, slug, label, kids, items };
    })
    .filter((l) => l.items.length > 0);
  const lineOf = (p: RawProduct) => lines.filter((l) => l.items.includes(p)).map((l) => l.label);

  const collections: Collection[] = lines.map((l) => ({
    slug: l.slug,
    department: 'Fashion',
    href: `/fashion/${l.slug}/`,
    crumbs: [HOME, crumb, { label: l.label }],
    title: l.label,
    intro: catBySlug.get(l.wp)?.description || `Explore ${l.label.toLowerCase()} for your store. ${PRICING}`,
    heroImage: LINE_IMAGE[l.slug] ?? '/images/hero.jpg',
    products: l.items.map((p) => {
      const types = l.kids.filter((k) => p.categories.includes(k.slug)).map((k) => typeName(k.name));
      return toProduct(p, l.label, [...new Set(types)]);
    }),
  }));

  // every earring, whichever line it belongs to
  const earringCats = categories.filter((c) => /^earrings?$/i.test(c.name)).map((c) => c.slug);
  const earrings: Collection = {
    slug: 'earrings',
    department: 'Fashion',
    href: '/fashion/earrings/',
    crumbs: [HOME, crumb, { label: 'Earrings' }],
    title: 'Earrings',
    intro: `Diamond, color, sterling silver and crystal earrings from every Diamond Emotions line. ${PRICING}`,
    heroImage: LINE_IMAGE.earrings,
    typeLabel: 'Collection',
    products: inAny(earringCats).map((p) => toProduct(p, 'Earrings', lineOf(p))),
  };
  collections.push(earrings);

  const main: Collection = {
    slug: '',
    department: 'Fashion',
    href: '/fashion/',
    crumbs: [HOME, { label: 'Fashion' }],
    title: 'Fashion Jewelry',
    intro: `Fashion, color and sterling silver collections that bring the couples you sold an engagement ring back for anniversaries, birthdays and gifts. ${PRICING}`,
    heroImage: LINE_IMAGE['diamond-fashion'],
    typeLabel: 'Collection',
    products: [...new Set(lines.flatMap((l) => l.items))].map((p) => toProduct(p, '', lineOf(p))),
  };
  // one page per product type in each line (Diamond Fashion → Rings, Pendants…)
  const types = lines.flatMap((l) => {
    const line = collections.find((c) => c.slug === l.slug)!;
    const names = [...new Set(l.kids.map((k) => typeName(k.name)))];
    return names.flatMap((name) => {
      const products = line.products.filter((p) => p.types.includes(name));
      if (!products.length) return [];
      const slug = typeSlug(name);
      return [
        {
          ...line,
          line: l.slug,
          slug,
          href: `${line.href}${slug}/`,
          crumbs: [HOME, crumb, { label: l.label, href: line.href }, { label: name }],
          title: `${l.label} ${name}`,
          intro: `${name} from the ${l.label} collection. ${PRICING}`,
          products,
        },
      ];
    });
  });

  // drawer "Product Type" links: the line's own page, then each of its type pages
  for (const line of collections) {
    const own = types.filter((t) => t.line === line.slug);
    if (!own.length) continue;
    const subTiles: CategoryTile[] = [
      { slug: '', label: `All ${line.title}`, href: line.href, image: '' },
      ...own.map((t) => ({ slug: t.slug, label: t.crumbs.at(-1)!.label, href: t.href, image: '' })),
    ];
    line.subTiles = subTiles;
    line.subSlug = '';
    for (const t of own) Object.assign(t, { tileSlug: line.slug, subTiles, subSlug: t.slug });
  }

  const tiles = collections.map((c) => tile(c, LINE_IMAGE[c.slug] ? { image: LINE_IMAGE[c.slug] } : undefined));
  return { label: 'Fashion', href: '/fashion/', main, collections, tiles, types };
})();

export const CATALOG = { bridal: BRIDAL, 'wedding-bands': WEDDING_BANDS, fashion: FASHION } as const;
export type DepartmentKey = keyof typeof CATALOG;

export function getCollection(dept: DepartmentKey, slug: string) {
  return CATALOG[dept].collections.find((c) => c.slug === slug);
}

export const FASHION_TYPES = FASHION.types!;

/** Every department's category tiles, for the filter drawer's Department switch */
export const TILES_BY_DEPARTMENT: TilesByDepartment = {
  [BRIDAL.label]: BRIDAL.tiles,
  [WEDDING_BANDS.label]: WEDDING_BANDS.tiles,
  [FASHION.label]: FASHION.tiles,
};
export const getFashionType = (line: string, type: string) => FASHION_TYPES.find((t) => t.line === line && t.slug === type);

// URL of a bridal style page by its name ("Split" → /bridal/split-shank/), if one exists
export function collectionHref(name: string) {
  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const c = BRIDAL.collections.find((x) => x.slug === key || x.slug.startsWith(`${key}-`));
  return c?.href ?? null;
}

// ---------- new arrivals ----------

const byStyle = new Map(products.map((p) => [p.style, p]));

// the style numbers listed on the old site's "New Designs" page, in its order
const newDesigns = (() => {
  const page = (rawPages as { slug: string; text: string }[]).find((p) => p.slug === 'new-designs');
  const lines = page?.text.split('\n') ?? [];
  return lines.filter((l, i) => lines[i + 1] === 'Call for Price').map((l) => l.trim().toUpperCase());
})();

export const NEW_ARRIVALS: Collection = {
  slug: 'new-arrivals',
  department: '',
  href: '/new-arrivals/',
  crumbs: [HOME, { label: 'New Arrivals' }],
  title: 'New Arrivals',
  intro: `The most recent additions to the Diamond Emotions collection. ${PRICING}`,
  heroImage: '/images/new-1.jpg',
  products: newDesigns.flatMap((s) => {
    const p = byStyle.get(s);
    return p ? [toProduct(p, '')] : [];
  }),
};

// home page "New Arrivals" carousel: the old home page's latest bridal styles
export const HOME_NEW_ARRIVALS: Product[] = ['ER9448', 'ER9447', 'ER9446', 'ER9445', 'ER3024-PC'].flatMap((s) => {
  const p = byStyle.get(s);
  return p ? [toProduct(p, 'Diamond Engagement Ring')] : [];
});

// ---------- product pages ----------

const SPEC_LABELS: Record<string, string> = {
  metalType: 'Metal',
  metalKarat: 'Karat',
  metalColor: 'Metal Color',
  metalFinish: 'Finish',
  metalWeight: 'Metal Weight',
  stoneType: 'Stone',
  stoneShape: 'Stone Shape',
  stoneColor: 'Stone Color',
  stoneSize: 'Stone Size',
  diamondShape: 'Diamond Shape',
  caratWeight: 'Total Carat Weight',
  numberOfDiamonds: 'Number of Diamonds',
  diamondColor: 'Diamond Color',
  diamondClarity: 'Diamond Clarity',
  setting: 'Setting',
  length: 'Length',
  earringType: 'Earring Type',
  style: 'Style',
  specialFeatures: 'Special Features',
  classifications: 'Classification',
  brand: 'Brand',
  aZ: 'Initial',
};

const ALL_COLLECTIONS = [...BRIDAL.collections, ...WEDDING_BANDS.collections, ...FASHION.collections.filter((c) => c.slug !== 'earrings')];
const MAINS = [BRIDAL.main, WEDDING_BANDS.main, FASHION.main];

export const PRODUCT_SLUGS = products.map((p) => p.slug);

export function getProduct(slug: string) {
  const raw = products.find((p) => p.slug === slug);
  if (!raw) return null;
  const collection =
    ALL_COLLECTIONS.find((c) => c.products.some((p) => p.slug === slug)) ??
    MAINS.find((c) => c.products.some((p) => p.slug === slug)) ??
    null;
  const card = collection?.products.find((p) => p.slug === slug) ?? toProduct(raw, '');
  const specs = Object.entries(SPEC_LABELS)
    .filter(([key]) => raw.attributes[key]?.length)
    .map(([key, label]) => ({ label, value: raw.attributes[key]!.join(', ') }));
  const related = (collection?.products ?? []).filter((p) => p.slug !== slug && p.image).slice(0, 4);
  return {
    ...card,
    description: raw.description,
    photos: photosOf(raw),
    specs,
    collection,
    related,
  };
}

// every catalogue page, for the sitemap
export const CATALOG_URLS = [
  ...MAINS.map((c) => c.href),
  ...ALL_COLLECTIONS.map((c) => c.href),
  FASHION.collections.find((c) => c.slug === 'earrings')!.href,
  NEW_ARRIVALS.href,
  ...FASHION.types!.map((t) => t.href),
  ...products.map((p) => `/product/${p.slug}/`),
];
