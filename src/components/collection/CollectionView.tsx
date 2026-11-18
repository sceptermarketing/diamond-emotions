import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Faq from '@/components/home/Faq';
import FinalCta from '@/components/home/FinalCta';
import type { CategoryTile, Collection } from '@/lib/collections';
import { TILES_BY_DEPARTMENT } from '@/lib/catalog';
import CollectionIntro from './CollectionIntro';
import ProductGrid from './ProductGrid';
import s from './CollectionView.module.css';

type Props = {
  collection: Collection;
  tiles?: CategoryTile[];
  // department main pages list their styles above the products
  showTiles?: boolean;
};

export function collectionMetadata(c: Collection): Metadata {
  return {
    title: `${c.title} | Diamond Emotions Wholesale`,
    description: c.intro,
    alternates: { canonical: c.href },
  };
}

export default function CollectionView({ collection: c, tiles = [], showTiles = false }: Props) {
  return (
    <>
      <Header variant="solid" />
      <main>
        <CollectionIntro collection={c} />
        {showTiles && tiles.length > 0 && (
          <section className={s.styles} aria-labelledby="shop-by">
            <h2 id="shop-by" className={s.heading}>
              Shop by {c.department === 'Fashion' ? 'Collection' : 'Style'}
            </h2>
            <ul className={s.tiles}>
              {tiles.map((t) => (
                <li key={t.slug}>
                  <Link href={t.href} className={s.tile}>
                    <span className={s.img}>
                      <img src={t.image} alt="" loading="lazy" style={t.contain ? { objectFit: 'contain' } : undefined} />
                    </span>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <ProductGrid
          products={c.products}
          tilesByDept={TILES_BY_DEPARTMENT}
          department={c.department}
          category={c.tileSlug ?? c.slug}
          subTiles={c.subTiles}
          sub={c.subSlug ?? ''}
          typeLabel={c.typeLabel}
        />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
