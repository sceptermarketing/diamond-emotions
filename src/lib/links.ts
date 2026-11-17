// Every URL on the site in one place. Inner pages are not built yet; their slugs are placeholders
// until the client confirms the sitemap.

export const PHONE = '517.574.4209';
export const PHONE_HREF = 'tel:+15175744209';
export const ADDRESS = ['2844 East Grand River Ave', 'East Lansing, MI 48823'] as const;

export const LINKS = {
  home: '/',
  bridal: '/bridal/',
  engagementRings: '/engagement-rings/',
  weddingBands: '/wedding-bands/',
  mensBands: '/mens-bands/',
  fashion: '/fashion/',
  colorFashion: '/fashion/color-fashion/',
  sterlingSilver: '/fashion/sterling-silver/',
  diamondFashion: '/fashion/diamond-fashion/',
  earrings: '/fashion/earrings/',
  newArrivals: '/new-arrivals/',
  custom: '/custom/',
  customOrder: '/custom-order-form/',
  customProcess: '/custom-design-process/',
  becomeRetailer: '/become-a-retailer/',
  retailerLogin: '/retailer-login/',
  forRetailers: '/for-retailers/',
  about: '/about/',
  history: '/our-history/',
  blog: '/blog/',
  contact: '/contact/',
  findJeweler: '/find-a-jeweler/',
  googleReviews: '#', // TODO: Google Business Profile reviews link
  // Google's "Diamond Emotions" listing (42.728804, -84.4554549); the street address alone lands in Lansing.
  map: 'https://www.google.com/maps/search/?api=1&query=Diamond+Emotions+2844+East+Grand+River+Ave+East+Lansing+MI+48823',
  // view-only embed centred on the store (no Google card, so the DE pin at the centre sits on it)
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11800!2d-84.4554549!3d42.728804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000',
  facebook: '#', // TODO
  instagram: '#', // TODO
  pinterest: '#', // TODO
} as const;
