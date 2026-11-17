import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import { LINKS } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Custom Design Process | Diamond Emotions',
  description: 'How a custom piece is made: a drawing, a CAD for approval, then the finished masterpiece in the metal color of your choice.',
  alternates: { canonical: LINKS.customProcess },
};

// From the old site's "Custom Design Process" page
const STEPS = [
  {
    title: 'Drawing',
    text: 'We are not asking you to be a Picasso or Van Gogh — just to have an imagination. If you can visualize it, we can help bring it to life. Send us a drawing of the idea, or let us draw it for you.',
  },
  {
    title: 'CAD',
    text: 'Once the drawing is approved, we create a Computer-Aided Design (CAD) showing the specs of the piece, so you and your customer can see exactly what is coming to life.',
  },
  {
    title: 'Masterpiece',
    text: 'From an idea, to a drawing and CAD, the piece becomes reality — crafted and shipped to your store, ready for your customer.',
  },
];

export default function CustomProcessPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Custom', href: LINKS.custom }, { label: 'Custom Design Process' }]}
        title="Custom Design Process"
        text="Three steps from your customer’s idea to a finished piece."
        image="/images/sketch.jpg"
      >
        <Link href={LINKS.customOrder} className="btn btn-sm btn-dark">
          Start a Custom Order
        </Link>
      </PageIntro>

      <div className={l.tinted}>
        <section className={l.tintedInner}>
          <div className={l.head}>
            <h2 className={l.heading}>How It Works</h2>
          </div>
          <ol className={l.steps}>
            {STEPS.map((s) => (
              <li key={s.title} className={l.step}>
                <h3 className={l.cardTitle}>{s.title}</h3>
                <p className={l.cardText}>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className={l.section}>
        <div className={l.split}>
          <div>
            <h2 className={l.heading}>Which Color Do You Want?</h2>
            <p className={l.lead}>
              Create a special identity by choosing a different color metal. Whether it’s white, rose, yellow or two-tone, we will
              help create the piece however your customer imagines it.
            </p>
          </div>
          <aside className={l.aside}>
            <h2 className={l.asideTitle}>Find Your Creativity</h2>
            <p>Browse custom pieces we have already made, or start from any style in the collection.</p>
            <div className={l.buttons}>
              <Link href={LINKS.custom} className="btn btn-sm btn-dark">
                View Our Designs
              </Link>
              <Link href={LINKS.bridal} className="btn btn-sm btn-outline">
                Find Your Ring
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
