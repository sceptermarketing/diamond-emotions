import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import WhyPartner from '@/components/home/WhyPartner';
import RetailerSteps from '@/components/home/RetailerSteps';
import CustomProgram from '@/components/home/CustomProgram';
import { LINKS } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'For Retailers | Diamond Emotions Wholesale',
  description:
    'Bridal, wedding bands, fashion and custom jewelry for independent jewelers. Wholesale only — we never sell around you.',
  alternates: { canonical: LINKS.forRetailers },
};

const LINKS_FOR_RETAILERS = [
  { title: 'Become a Retailer', text: 'Apply to carry Diamond Emotions in your store.', href: LINKS.becomeRetailer, cta: 'Apply now' },
  { title: 'Retailer Login', text: 'Pricing, orders and order status for authorized retailers.', href: LINKS.retailerLogin, cta: 'Log in' },
  { title: 'Custom Order Form', text: 'Send us your customer’s custom piece.', href: LINKS.customOrder, cta: 'Start an order' },
  { title: 'Custom Design Process', text: 'Drawing, CAD, masterpiece — how a custom piece is made.', href: LINKS.customProcess, cta: 'See how it works' },
];

export default function ForRetailersPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'For Retailers' }]}
        title="For Retailers"
        text="Everything your bridal case needs, nothing that competes with it. Diamond Emotions is wholesale only — built by a retailer, for independent jewelers."
        image="/images/why-bridal.jpg"
      >
        <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-dark">
          Become a Retailer
        </Link>
      </PageIntro>
      <section className={l.section}>
        <ul className={l.cards}>
          {LINKS_FOR_RETAILERS.map((c) => (
            <li key={c.title}>
              <Link href={c.href} className={l.card}>
                <h2 className={l.cardTitle}>{c.title}</h2>
                <p className={l.cardText}>{c.text}</p>
                <span className={l.cardLink}>{c.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <WhyPartner />
      <RetailerSteps />
      <CustomProgram />
    </PageShell>
  );
}
