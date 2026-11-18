// Where each old WordPress product category lives on the new site.
// Shared by the site (src/lib/catalog.ts) and the importer (scripts/import-wp.mjs), which turns these
// rules into redirects from the old category URLs.

/** Fashion lines: old top-level WordPress category → new URL slug under /fashion/ */
export const FASHION_LINES = {
  color: 'color-fashion',
  'diamond-fashion': 'diamond-fashion',
  'sterling-silver': 'sterling-silver',
  'gerri-g-collection': 'gerri-g-collection',
  'swarovski-crystal-collection': 'swarovski-crystal',
  twistals: 'twistals',
  fashion: 'fashion-jewelry',
};

/** URL slug for a bridal or wedding band style category ("halo-designs" → "halo", "classic-wedding-bands" → "classic") */
export function styleSlug(wpSlug) {
  return wpSlug === 'halo-designs' ? 'halo' : wpSlug.replace(/-wedding-bands$/, '');
}

// a fashion line's product type from its old sub-category name ("Pendant", "Color Pendants" → "Pendants")
const TYPE_FIX = { Pendant: 'Pendants', Necklace: 'Necklaces', Earring: 'Earrings', Bracelet: 'Bracelets', Lariat: 'Lariats' };
export function typeName(name) {
  const n = name.replace(/^Color /, '');
  return TYPE_FIX[n] ?? n;
}
/** URL slug of a product type ("Pendants" → "pendants") */
export const typeSlug = (name) => typeName(name).toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** New page URL for an old product category ({ slug, parent, name }), or null when it has none */
export function categoryUrl(cat) {
  if (cat.slug === 'bridal' || cat.slug === 'engagement-rings') return '/bridal/';
  if (cat.parent === 'engagement-rings') return `/bridal/${styleSlug(cat.slug)}/`;
  if (cat.slug === 'wedding-bands') return '/wedding-bands/';
  if (cat.parent === 'wedding-bands') return `/wedding-bands/${styleSlug(cat.slug)}/`;
  if (cat.slug === 'custom' || cat.parent === 'custom') return '/custom/';
  if (FASHION_LINES[cat.slug]) return `/fashion/${FASHION_LINES[cat.slug]}/`;
  // a line's sub-category (Rings, Pendants…) has its own page under the line
  if (FASHION_LINES[cat.parent]) return `/fashion/${FASHION_LINES[cat.parent]}/${typeSlug(cat.name)}/`;
  return null;
}
