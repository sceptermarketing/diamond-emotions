import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import { POSTS, formatDate } from '@/lib/content';
import l from '@/components/content/Layout.module.css';
import s from '@/components/content/Blog.module.css';

export const metadata: Metadata = {
  title: 'Blog | Diamond Emotions',
  description: 'Bridal and fine jewelry guides from Diamond Emotions.',
  alternates: { canonical: '/blog/' },
};

export default function BlogPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        title="Blog"
        text="Guides to diamonds, wedding bands and the pieces your customers ask about."
      />
      <section className={l.section}>
        <ul className={s.posts}>
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link href={p.href} className={s.post}>
                <span className={s.photo}>
                  {p.image ? <img src={p.image.src} alt={p.image.alt} loading="lazy" /> : <span className={s.mark}>DE</span>}
                </span>
                <span className={s.body}>
                  <time dateTime={p.date} className={s.date}>
                    {formatDate(p.date)}
                  </time>
                  <span className={s.title}>{p.title}</span>
                  <span className={s.excerpt}>{p.excerpt.split(/(?<=\.)\s/).slice(0, 2).join(' ')}</span>
                  <span className={s.more}>Read article →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
