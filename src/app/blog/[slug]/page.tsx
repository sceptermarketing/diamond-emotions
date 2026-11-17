import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Prose from '@/components/content/Prose';
import { POSTS, formatDate, getPost } from '@/lib/content';
import { LINKS } from '@/lib/links';
import l from '@/components/content/Layout.module.css';
import s from '@/components/content/Blog.module.css';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title} | Diamond Emotions Blog`,
    description: p.excerpt.slice(0, 160),
    alternates: { canonical: p.href },
    openGraph: { type: 'article', publishedTime: p.date, images: p.image ? [p.image.src] : undefined },
  };
}

export default async function PostPage({ params }: Params) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const others = POSTS.filter((x) => x.slug !== p.slug);

  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: LINKS.blog }, { label: p.title }]}
        title={p.title}
        image={p.image?.src}
      >
        <time dateTime={p.date}>{formatDate(p.date)}</time>
      </PageIntro>
      <section className={l.section}>
        <div className={l.split}>
          <Prose html={p.html} className={s.article} />
          <aside className={l.aside}>
            <h2 className={l.asideTitle}>Sell Diamond Emotions</h2>
            <p>Bridal, wedding bands and fine jewelry, sold only through independent jewelers.</p>
            <div className={l.buttons}>
              <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-dark">
                Become a Retailer
              </Link>
            </div>
            {others.length > 0 && (
              <>
                <h3 className={s.asideHead}>More Articles</h3>
                <ul className={l.toc}>
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={o.href}>{o.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
