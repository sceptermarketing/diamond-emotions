import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Prose from '@/components/content/Prose';
import { pageHtml } from '@/lib/content';
import { LINKS } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Our History | Diamond Emotions',
  description:
    'How Rick and Gerri Gouthro went from shopping for an engagement ring in college to founding Diamond Emotions in 2009.',
  alternates: { canonical: LINKS.history },
};

export default function OurHistoryPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: LINKS.about }, { label: 'Our History' }]}
        title="Our History"
        text="“It’s all about emotion.” From a college ring-shopping trip to a wholesale jewelry house serving independent jewelers."
        image="/images/story.jpg"
      />
      <section className={l.section}>
        <div className={l.split}>
          <Prose html={pageHtml('our-history')} className={l.proseFull} />
          <aside className={l.aside}>
            <h2 className={l.asideTitle}>Partner With Us</h2>
            <p>Diamond Emotions works only with independent jewelers. See how we help you sell more bridal.</p>
            <div className={l.buttons}>
              <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-dark">
                Become a Retailer
              </Link>
              <Link href={LINKS.about} className="btn btn-sm btn-outline">
                About Us
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
