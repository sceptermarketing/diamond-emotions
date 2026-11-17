import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import { EMAIL, LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Retailer Login | Diamond Emotions',
  description: 'Access for authorized Diamond Emotions retailers.',
  alternates: { canonical: LINKS.retailerLogin },
  robots: { index: false },
};

// The retailer portal is not part of the new site yet; this page tells existing partners how to reach the team.
export default function RetailerLoginPage() {
  return (
    <PageShell cta={false}>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'For Retailers', href: LINKS.forRetailers }, { label: 'Retailer Login' }]}
        title="Retailer Login"
        text="For authorized Diamond Emotions retailers."
      />
      <section className={l.section}>
        <ul className={l.cards}>
          <li className={l.card}>
            <h2 className={l.cardTitle}>Existing Retailers</h2>
            <p className={l.cardText}>
              Our new retailer portal is on its way. In the meantime, our team is ready to help with pricing, orders and order status.
            </p>
            <div className={l.buttons}>
              <a href={PHONE_HREF} className="btn btn-sm btn-dark">
                Call {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="btn btn-sm btn-outline">
                Email Us
              </a>
            </div>
          </li>
          <li className={l.card}>
            <h2 className={l.cardTitle}>New to Diamond Emotions?</h2>
            <p className={l.cardText}>Apply to carry our bridal, wedding band and fashion lines in your store.</p>
            <div className={l.buttons}>
              <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-dark">
                Become a Retailer
              </Link>
            </div>
          </li>
          <li className={l.card}>
            <h2 className={l.cardTitle}>Custom Orders</h2>
            <p className={l.cardText}>Send us a custom order and we’ll confirm the details within 24 business hours.</p>
            <div className={l.buttons}>
              <Link href={LINKS.customOrder} className="btn btn-sm btn-outline">
                Custom Order Form
              </Link>
            </div>
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
