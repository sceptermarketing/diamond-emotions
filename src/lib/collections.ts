// Collection pages (bridal styles). Each entry drives one page from the "Collection Pages template".
// Product photos come from the Figma design; the design repeats ER2001 on every card, so style numbers
// here are placeholders in sequence until the client sends the real catalog.

export type Metal = 'White Gold' | 'Yellow Gold';

export type Product = {
  style: string;
  name: string;
  image: string;
  metal: Metal;
};

export type Collection = {
  slug: string;
  parent: { label: string; href: string };
  title: string;
  intro: string;
  heroImage: string;
  products: Product[];
};

const RING_PHOTOS: { image: string; metal: Metal }[] = [
  { image: '/images/collections/ring-1.jpg', metal: 'Yellow Gold' },
  { image: '/images/collections/ring-2.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-3.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-4.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-5.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-6.jpg', metal: 'White Gold' },
  { image: '/images/collections/ring-7.jpg', metal: 'White Gold' },
];

function placeholderProducts(count: number, name: string): Product[] {
  return Array.from({ length: count }, (_, i) => {
    // first row as in the design, then the design's repeating 4-photo row
    const photo = i < 4 ? RING_PHOTOS[i] : RING_PHOTOS[[4, 5, 6, 1][i % 4]];
    return { style: `ER${2001 + i}`, name, ...photo };
  });
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'cathedral',
    parent: { label: 'Bridal', href: '/bridal/' },
    title: 'Cathedral Engagement Rings',
    intro:
      'Discover cathedral settings for your bridal collection. Explore each design, then call our team with the style number for pricing and ordering.',
    heroImage: '/images/collections/cathedral-hero.jpg',
    products: placeholderProducts(30, 'Micro-pavé cathedral ring'),
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
