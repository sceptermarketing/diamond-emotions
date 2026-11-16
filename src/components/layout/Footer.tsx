import Link from 'next/link';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import s from './Footer.module.css';

const COLUMNS = [
  {
    title: 'Collections',
    width: 141,
    links: [
      { label: 'Engagement Rings', href: LINKS.engagementRings },
      { label: 'Wedding Bands', href: LINKS.weddingBands },
      { label: "Men's Bands", href: LINKS.mensBands },
      { label: 'Fashion', href: LINKS.fashion },
      { label: 'New Arrivals', href: LINKS.newArrivals },
    ],
  },
  {
    title: 'For Retailers',
    width: 193,
    links: [
      { label: 'Become a Retailer', href: LINKS.becomeRetailer },
      { label: 'Retailer Login', href: LINKS.retailerLogin },
      { label: 'Custom Order Form', href: LINKS.customOrder },
      { label: 'Custom Design Process', href: LINKS.customProcess },
    ],
  },
  {
    title: 'Company',
    width: 155,
    links: [
      { label: 'About Us', href: LINKS.about },
      { label: 'Our History', href: LINKS.history },
      { label: 'Blog', href: LINKS.blog },
      { label: 'Contact', href: LINKS.contact },
      { label: 'Find a Jeweler', href: LINKS.findJeweler },
    ],
  },
];

const SOCIAL = [
  { label: 'Facebook', href: LINKS.facebook, icon: '/images/social-facebook.png' },
  { label: 'Instagram', href: LINKS.instagram, icon: '/images/social-instagram.png' },
  { label: 'Pinterest', href: LINKS.pinterest, icon: '/images/social-pinterest.png' },
];

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.main}>
        <div className={s.top}>
          <Link href={LINKS.home} className={s.logo} aria-label="Diamond Emotions home">
            <img src="/images/logo.png" alt="Diamond Emotions" width={193} height={64} />
          </Link>
          <div className={s.leadRow}>
            <p>Shopping for an engagement ring? Diamond Emotions jewelry is sold exclusively through independent jewelers.</p>
            <Link href={LINKS.findJeweler} className={s.find}>
              <span className={s.pin} aria-hidden>
                <img src="/images/pin-sprite.png" alt="" />
              </span>
              Find a Jeweler Near You
            </Link>
          </div>
        </div>

        <hr className={s.rule} />

        <div className={s.cols}>
          <div className={s.col} style={{ flex: '1 0 0' }}>
            <p className={s.title}>Diamond Emotions</p>
            <div className={s.list}>
              <p className={s.strong}>Address:</p>
              <p>2844 East Grand River Ave</p>
              <p>East Lansing, MI 48823</p>
            </div>
            <div className={s.list}>
              <p className={s.strong}>Phone:</p>
              <p>
                <a href={PHONE_HREF}>{PHONE}</a>
              </p>
            </div>
            <div className={s.hours}>
              <p className={s.strong}>Mon - Thu:</p>
              <p>09:00am – 05:00pm</p>
              <p className={s.strong}>Fri:</p>
              <p>09:00am – 04:00pm</p>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className={s.col} style={{ width: col.width }}>
              <p className={s.title}>{col.title}</p>
              <ul className={s.list}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <a href={LINKS.map} className={s.map} target="_blank" rel="noopener noreferrer">
            <img src="/images/map.png" alt="Map: Diamond Emotions, 2844 East Grand River Ave, East Lansing" loading="lazy" />
          </a>
        </div>
      </div>

      <div className={s.bottom}>
        <p>{'© Copyright 2026   |    All Rights Reserved   |   Powered by Scepter'}</p>
        <div className={s.social}>
          {SOCIAL.map((n) => (
            <a key={n.label} href={n.href} aria-label={n.label}>
              <img src={n.icon} alt="" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
