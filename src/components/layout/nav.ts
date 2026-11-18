import { LINKS, PHONE_DISPLAY, PHONE_HREF } from '@/lib/links';

// Main menu: the seven tabs and their dropdowns, from Figma "Menu" (821:2620, e.g. Bridal 821:2122).
// Destinations are the new site's pages for the old site's sections; the old URLs redirect to them.

export type MenuLink = { label: string; href: string; arrow?: boolean };
export type MenuColumn = { title: string; muted?: boolean; width: number; links: MenuLink[] };

export type Feature =
  | { kind: 'image'; width: number; image: string; imageHeight: number; title: string; link: MenuLink }
  | {
      kind: 'card';
      width: number;
      padding: string;
      eyebrow?: string;
      title: string;
      titleSize: number;
      text: string;
      textSize: number;
      textWidth?: number;
      link: MenuLink;
      note?: string;
      after?: MenuLink;
    }
  | {
      kind: 'steps';
      width: number;
      title: string;
      steps: string[];
      text: string;
      image: string;
      imageWidth: number;
      imageHeight: number;
      link: MenuLink;
    }
  | { kind: 'posts'; posts: { eyebrow: string; title: string; text: string; href: string }[] };

export type NavItem = { label: string; href: string; columns: MenuColumn[]; feature?: Feature };

const CALL: MenuLink = { label: `Call ${PHONE_DISPLAY}`, href: PHONE_HREF };

export const NAV: NavItem[] = [
  {
    label: 'Bridal',
    href: LINKS.bridal,
    columns: [
      {
        title: 'Engagement Rings',
        width: 240,
        links: [
          { label: 'All Engagement Rings', href: '/bridal/' },
          { label: 'Classic', href: '/bridal/classic/' },
          { label: 'Cathedral', href: '/bridal/cathedral/' },
          { label: 'Halo', href: '/bridal/halo/' },
          { label: 'Solitaire', href: '/bridal/solitaire/' },
          { label: 'Three-Stone', href: '/bridal/3-stone/' },
        ],
      },
      {
        title: 'Explore Styles',
        width: 240,
        links: [
          { label: 'Bypass', href: '/bridal/bypass/' },
          { label: 'Carved', href: '/bridal/carved/' },
          { label: 'Fancy', href: '/bridal/fancy/' },
          { label: 'Invisible', href: '/bridal/invisible/' },
          { label: 'Split Shank', href: '/bridal/split-shank/' },
          { label: 'Twist', href: '/bridal/twist/' },
          { label: 'Vintage', href: '/bridal/vintage/' },
        ],
      },
      {
        title: 'Make It Personal',
        width: 240,
        links: [
          { label: 'New Arrivals', href: LINKS.newArrivals },
          { label: 'Custom Design Process', href: LINKS.customProcess },
          { label: 'Wedding Bands', href: LINKS.weddingBands },
          { label: 'Find a Jeweler', href: LINKS.findJeweler },
        ],
      },
    ],
    feature: {
      kind: 'image',
      width: 400,
      image: '/images/menu/bridal.webp',
      imageHeight: 180,
      title: 'A setting for their story.',
      link: { label: 'Explore all bridal', href: LINKS.bridal, arrow: true },
    },
  },
  {
    label: 'Wedding Bands',
    href: LINKS.weddingBands,
    columns: [
      {
        title: 'Wedding Bands',
        width: 240,
        links: [
          { label: 'All Wedding Bands', href: '/wedding-bands/' },
          { label: 'Men’s Bands', href: '/wedding-bands/mens-bands/' },
          { label: 'Classic', href: '/wedding-bands/classic/' },
          { label: 'Diamond Bands', href: '/wedding-bands/diamond-bands/' },
          { label: 'Eternity', href: '/wedding-bands/eternity/' },
          { label: 'Plain', href: '/wedding-bands/plain/' },
        ],
      },
      {
        title: 'Find the Perfect Fit',
        muted: true,
        width: 240,
        links: [
          { label: 'Curved', href: '/wedding-bands/curved/' },
          { label: 'Fitted', href: '/wedding-bands/fitted/' },
          { label: 'Shadow', href: '/wedding-bands/shadow/' },
          { label: 'Bypass', href: '/wedding-bands/bypass/' },
          { label: 'Twist', href: '/wedding-bands/twist/' },
          { label: 'Two-Stone', href: '/wedding-bands/two-stone/' },
        ],
      },
      {
        title: 'Distinctive Details',
        muted: true,
        width: 240,
        links: [
          { label: 'Carved', href: '/wedding-bands/carved/' },
          { label: 'Fancy', href: '/wedding-bands/fancy/' },
          { label: 'Halo', href: '/wedding-bands/halo/' },
          { label: 'Invisible', href: '/wedding-bands/invisible/' },
          { label: 'Vintage', href: '/wedding-bands/vintage/' },
          // the old site has no three-stone bands; three-stone rings live under Bridal
          { label: 'Three-Stone', href: '/bridal/3-stone/' },
        ],
      },
    ],
    feature: {
      kind: 'card',
      width: 400,
      padding: '28px',
      title: 'The next chapter.',
      titleSize: 34,
      text: 'Explore bands to complement their engagement ring, or make a statement on their own.',
      textSize: 14,
      link: { label: 'Explore wedding bands', href: LINKS.weddingBands, arrow: true },
      note: 'Have a style number in mind?',
      after: CALL,
    },
  },
  {
    label: 'Fashion',
    href: LINKS.fashion,
    columns: [
      {
        title: 'Diamond Fashion',
        width: 250,
        links: [
          { label: 'All Diamond Fashion', href: '/fashion/diamond-fashion/' },
          { label: 'Rings', href: '/fashion/diamond-fashion/rings/' },
          { label: 'Bands', href: '/fashion/diamond-fashion/bands/' },
          { label: 'Bracelets', href: '/fashion/diamond-fashion/bracelets/' },
          { label: 'Earrings', href: '/fashion/diamond-fashion/earrings/' },
          { label: 'Pendants', href: '/fashion/diamond-fashion/pendants/' },
        ],
      },
      {
        title: 'Color Fashion',
        width: 250,
        links: [
          { label: 'All Color Fashion', href: '/fashion/color-fashion/' },
          { label: 'Rings', href: '/fashion/color-fashion/rings/' },
          // no color bands on the old site; color rings are the closest match
          { label: 'Bands', href: '/fashion/color-fashion/rings/' },
          { label: 'Earrings', href: '/fashion/color-fashion/earrings/' },
          { label: 'Pendants', href: '/fashion/color-fashion/pendants/' },
        ],
      },
      {
        title: 'Sterling Silver',
        width: 250,
        links: [
          { label: 'All Sterling Silver', href: '/fashion/sterling-silver/' },
          { label: 'Bracelets', href: '/fashion/sterling-silver/bracelets/' },
          { label: 'Earrings', href: '/fashion/sterling-silver/earrings/' },
          { label: 'Pendants', href: '/fashion/sterling-silver/pendants/' },
          // no sterling silver rings on the old site; the line page shows everything it has
          { label: 'Rings', href: '/fashion/sterling-silver/' },
          { label: 'Necklaces', href: '/fashion/sterling-silver/necklaces/' },
        ],
      },
      {
        title: 'More Collections',
        width: 410,
        links: [
          { label: 'Gerri G Collection', href: '/fashion/gerri-g-collection/' },
          { label: 'Swarovski Crystal Collection', href: '/fashion/swarovski-crystal/' },
          { label: 'Twistals', href: '/fashion/twistals/' },
          { label: 'Fashion Collection', href: '/fashion/fashion-jewelry/' },
          { label: 'New Arrivals', href: LINKS.newArrivals },
        ],
      },
    ],
  },
  {
    label: 'Custom',
    href: LINKS.custom,
    columns: [
      {
        title: 'Create Something Personal',
        width: 340,
        links: [
          { label: 'Explore Custom Designs', href: LINKS.custom },
          { label: 'Custom Design Process', href: LINKS.customProcess },
          // the design keeps custom work on a call-to-order flow, so this goes to the team
          { label: 'Discuss a Custom Design', href: LINKS.contact },
        ],
      },
    ],
    feature: {
      kind: 'steps',
      width: 420,
      title: 'From an idea to a keepsake.',
      steps: ['Drawing', 'Computer-aided design', 'Finished masterpiece'],
      text: 'Share your idea with our team. We’ll guide the design conversation.',
      image: '/images/menu/custom.webp',
      imageWidth: 440,
      imageHeight: 240,
      link: { label: 'Call to discuss your design', href: PHONE_HREF, arrow: true },
    },
  },
  {
    label: 'For Retailer',
    href: LINKS.forRetailers,
    columns: [
      {
        title: 'Retailer Resources',
        width: 340,
        links: [
          { label: 'Retailer Login', href: LINKS.retailerLogin },
          { label: 'Become a Retailer', href: LINKS.becomeRetailer },
          { label: 'Contact Our Team', href: LINKS.contact },
          { label: 'Find a Jeweler', href: LINKS.findJeweler },
        ],
      },
    ],
    feature: {
      kind: 'card',
      width: 860,
      padding: '32px',
      title: 'For the stories your customers bring.',
      titleSize: 34,
      text: 'Wholesale only. Browse collections, note the style number, and call our team to discuss availability and place your order.',
      textSize: 15,
      textWidth: 650,
      link: CALL,
    },
  },
  {
    label: 'About',
    href: LINKS.about,
    columns: [
      {
        title: 'Diamond Emotions',
        width: 340,
        links: [
          { label: 'About Us', href: LINKS.about },
          { label: 'Contact Us', href: LINKS.contact },
          { label: 'Find a Jeweler', href: LINKS.findJeweler },
        ],
      },
    ],
    feature: {
      kind: 'card',
      width: 860,
      padding: '30px 32px',
      eyebrow: 'Since 2009',
      title: 'Jewelry with emotion at its heart.',
      titleSize: 36,
      text: 'Get to know Diamond Emotions, connect with our team, or find a jeweler near you.',
      textSize: 15,
      textWidth: 650,
      link: { label: 'Our story', href: LINKS.history, arrow: true },
    },
  },
  {
    label: 'Blogs',
    href: LINKS.blog,
    columns: [{ title: 'Ideas & Inspiration', width: 280, links: [{ label: 'All Articles', href: LINKS.blog }] }],
    feature: {
      kind: 'posts',
      posts: [
        {
          eyebrow: 'Gifting',
          title: 'Why Are Unique Diamond Pendants A Perfect Gift?',
          text: 'Discover the meaning behind a timeless jewelry gift.',
          href: '/blog/why-are-unique-diamond-pendants-a-perfect-gift/',
        },
        {
          eyebrow: 'Wedding Bands',
          title: 'Everything You Need To Know About Unique Diamond Wedding Bands',
          text: 'Explore the details that make a wedding band personal.',
          href: '/blog/everything-you-need-to-know-about-unique-diamond-wedding-bands/',
        },
      ],
    },
  },
];

/** Every link in a menu, in order and without repeats (mobile menu) */
export function menuLinks(item: NavItem): MenuLink[] {
  const seen = new Set<string>();
  return item.columns
    .flatMap((c) => c.links)
    .filter((l) => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
}
