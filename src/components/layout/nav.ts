import { LINKS } from '@/lib/links';

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

// Main menu from the design. Dropdown entries use the collections and pages named elsewhere in the
// design (footer, milestone cards) until the client gives the final menu.
export const NAV: NavItem[] = [
  { label: 'Bridal', href: LINKS.bridal },
  {
    label: 'Wedding Bands',
    href: LINKS.weddingBands,
    children: [
      { label: 'Wedding Bands', href: LINKS.weddingBands },
      { label: "Men's Bands", href: LINKS.mensBands },
    ],
  },
  {
    label: 'Fashion',
    href: LINKS.fashion,
    children: [
      { label: 'Color Fashion', href: LINKS.colorFashion },
      { label: 'Sterling Silver', href: LINKS.sterlingSilver },
      { label: 'Diamond Fashion', href: LINKS.diamondFashion },
      { label: 'Earrings', href: LINKS.earrings },
    ],
  },
  {
    label: 'Custom',
    href: LINKS.custom,
    children: [
      { label: 'Custom Order Form', href: LINKS.customOrder },
      { label: 'Custom Design Process', href: LINKS.customProcess },
    ],
  },
  {
    label: 'For Retailer',
    href: LINKS.forRetailers,
    children: [
      { label: 'Become a Retailer', href: LINKS.becomeRetailer },
      { label: 'Retailer Login', href: LINKS.retailerLogin },
    ],
  },
  { label: 'About', href: LINKS.about },
  { label: 'Blogs', href: LINKS.blog },
];
