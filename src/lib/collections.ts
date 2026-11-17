// Shared catalogue types and constants. Safe to import from client components:
// the product data itself lives in ./catalog.ts (server only), so it never ships to the browser in full.

export type Product = {
  slug: string;
  href: string;
  style: string; // style number, e.g. ER9289
  name: string;
  image: string | null;
  alt: string;
  stones: string[];
  shapes: string[];
  settings: string[];
  types: string[]; // product type within a fashion line (Pendants, Earrings…) or the line itself
};

// "Product Categories" tile in the filter drawer, linking to a collection page
export type CategoryTile = { slug: string; label: string; href: string; image: string; contain?: boolean };

export type Crumb = { label: string; href?: string };

export type Collection = {
  slug: string; // '' for a department's main page
  department: string; // department label
  href: string;
  crumbs: Crumb[];
  title: string;
  intro: string;
  heroImage: string;
  typeLabel?: string; // drawer heading for the `types` filter
  products: Product[];
};

export const DEPARTMENTS = [
  { label: 'Bridal', href: '/bridal/' },
  { label: 'Wedding Bands', href: '/wedding-bands/' },
  { label: 'Fashion', href: '/fashion/' },
] as const;

// Stone shapes with a drawn icon in /images/filters; any other shape falls back to the round icon
export const SHAPE_ICONS = ['baguette', 'cushion', 'emerald', 'marquise', 'oval', 'pear', 'princess', 'round'];
