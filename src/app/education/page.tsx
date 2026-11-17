import type { Metadata } from 'next';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Prose from '@/components/content/Prose';
import { educationContent } from '@/lib/content';
import l from '@/components/content/Layout.module.css';

const { intro, html, toc } = educationContent();

export const metadata: Metadata = {
  title: 'Jewelry Education | Diamond Emotions',
  description: 'Diamonds and the 4 C’s, precious metals, ring sizing, pearls, gemstones, birthstones and jewelry terms to know.',
  alternates: { canonical: '/education/' },
};

export default function EducationPage() {
  return (
    <PageShell>
      <PageIntro crumbs={[{ label: 'Home', href: '/' }, { label: 'Education' }]} title="Jewelry Education" text={intro} />
      <section className={l.section}>
        <div className={l.split}>
          <Prose html={html} />
          <aside className={l.aside} aria-label="On this page">
            <h2 className={l.asideTitle}>On This Page</h2>
            <ul className={l.toc}>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.title}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
