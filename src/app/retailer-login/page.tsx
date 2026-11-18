import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import Crumbs from '@/components/layout/Crumbs';
import { EMAIL, HOURS, LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import s from '@/components/content/RetailerLogin.module.css';

export const metadata: Metadata = {
  title: 'Retailer Login | Diamond Emotions',
  description: 'Access for authorized Diamond Emotions retailers.',
  alternates: { canonical: LINKS.retailerLogin },
  robots: { index: false },
};

const Icon = ({ d }: { d: string }) => (
  <span className={s.icon} aria-hidden>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  </span>
);

// The retailer portal is not part of the new site yet; this page tells existing partners how to reach the team.
export default function RetailerLoginPage() {
  return (
    <PageShell cta={false}>
      <section className={s.page}>
        <div className={s.head}>
          <Crumbs
            items={[{ label: 'Home', href: '/' }, { label: 'For Retailers', href: LINKS.forRetailers }, { label: 'Retailer Login' }]}
            className={s.crumbs}
          />
          <p className={s.eyebrow}>Authorized Retailers</p>
          <h1 className={s.title}>Retailer Login</h1>
          <p className={s.lead}>
            Welcome back. Our new retailer portal is on its way — until then, our team is ready to help with pricing, orders and
            order status.
          </p>
        </div>

        <ul className={s.cards}>
          <li className={s.card}>
            <Icon d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" />
            <h2 className={s.cardTitle}>New to Diamond Emotions?</h2>
            <p className={s.cardText}>Apply to carry our bridal, wedding band and fashion lines in your store.</p>
            <Link href={LINKS.becomeRetailer} className={`btn btn-sm btn-outline ${s.cardBtn}`}>
              Become a Retailer
            </Link>
          </li>

          <li className={`${s.card} ${s.featured}`}>
            <span className={s.badge}>Existing Retailers</span>
            <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />
            <h2 className={s.cardTitle}>Retailer Portal</h2>
            <p className={s.cardText}>
              Coming soon. For pricing, new orders and order status, call or email our team — we’ll take care of it right away.
            </p>
            <div className={s.cardActions}>
              <a href={PHONE_HREF} className={`btn btn-sm btn-light ${s.cardBtn}`}>
                Call {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className={`btn btn-sm btn-outline-light ${s.cardBtn}`}>
                Email Us
              </a>
            </div>
          </li>

          <li className={s.card}>
            <Icon d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            <h2 className={s.cardTitle}>Custom Orders</h2>
            <p className={s.cardText}>Send us your customer’s custom piece. We confirm the details within 24 business hours.</p>
            <Link href={LINKS.customOrder} className={`btn btn-sm btn-outline ${s.cardBtn}`}>
              Custom Order Form
            </Link>
          </li>
        </ul>

        <p className={s.help}>
          Need a hand? Our team is available {HOURS[0][0]}, {HOURS[0][1]} ·{' '}
          <a href={PHONE_HREF}>{PHONE}</a> · <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </section>
    </PageShell>
  );
}
