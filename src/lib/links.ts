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
  mapEmbed: 'https://maps.google.com/maps?q=42.728804,-84.4554549&z=13&output=embed',
  facebook: '#', // TODO
  instagram: '#', // TODO
  pinterest: '#', // TODO
} as const;
