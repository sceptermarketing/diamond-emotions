import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Crumbs from '@/components/layout/Crumbs';
import FinalCta from '@/components/home/FinalCta';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCards from '@/components/product/ProductCards';
import { PRODUCT_SLUGS, getProduct } from '@/lib/catalog';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import type { Crumb } from '@/lib/collections';
import s from '@/components/product/ProductDetail.module.css';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.style} ${p.name === p.style ? '' : `– ${p.name}`} | Diamond Emotions Wholesale`.replace('  ', ' '),
    description: (p.description || `${p.style} ${p.name}`).slice(0, 160),
    alternates: { canonical: p.href },
    openGraph: p.image ? { images: [p.image] } : undefined,
  };
}

export default async function ProductPage({ params }: Params) {
  const p = getProduct((await params).slug);
  if (!p) notFound();

  const crumbs: Crumb[] = p.collection
    ? [...p.collection.crumbs.slice(0, -1), { label: p.collection.crumbs.at(-1)!.label, href: p.collection.href }, { label: p.style }]
    : [{ label: 'Home', href: '/' }, { label: p.style }];
  const paragraphs = p.description.split('\n').filter((line) => line && line !== p.name);

  return (
    <>
      <Header variant="solid" />
      <main>
        <div className={s.crumbBar}>
          <Crumbs items={crumbs} className={s.crumbs} />
        </div>

        <section className={s.product}>
          <ProductGallery photos={p.photos} style={p.style} />

          <div className={s.info}>
            <div className={s.head}>
              <h1 className={s.style}>{p.style}</h1>
              {p.name !== p.style && <p className={s.name}>{p.name}</p>}
            </div>

            <div className={s.pricing}>
              <p className={s.price}>Call For Price</p>
              <p className={s.note}>
                Wholesale pricing by phone for authorized retailers. Have the style number ready when you call.
              </p>
              <div className={s.buttons}>
                <a href={PHONE_HREF} className="btn btn-sm btn-dark">
                  Call {PHONE}
                </a>
                <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-outline">
                  Become a Retailer
                </Link>
              </div>
              <p className={s.custom}>
                Want it changed? <Link href={`${LINKS.customOrder}?style=${encodeURIComponent(p.style)}`}>Start a custom order →</Link>
              </p>
            </div>

            {paragraphs.length > 0 && (
              <div className={s.description}>
                {paragraphs.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}

            {p.specs.length > 0 && (
              <div className={s.specs}>
                <h2 className={s.specsTitle}>Specifications</h2>
                <dl>
                  <div>
                    <dt>Style Number</dt>
                    <dd>{p.style}</dd>
                  </div>
                  {p.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>

        {p.related.length > 0 && p.collection && (
          <section className={s.related} aria-labelledby="related-title">
            <div className={s.relatedHead}>
              <h2 id="related-title" className={s.relatedTitle}>
                More {p.collection.title}
              </h2>
              <Link href={p.collection.href} className={s.viewAll}>
                View all →
              </Link>
            </div>
            <ProductCards products={p.related} />
          </section>
        )}

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
