import Link from 'next/link';
import type { Product } from '@/lib/collections';
import s from '@/components/collection/ProductGrid.module.css';

// The collection grid's cards without the toolbar, for related styles
export default function ProductCards({ products }: { products: Product[] }) {
  return (
    <ul className={s.grid}>
      {products.map((p) => (
        <li key={p.slug}>
          <Link href={p.href} className={s.card}>
            <span className={s.photo}>
              {p.image ? (
                <img src={p.image} alt={p.alt} loading="lazy" />
              ) : (
                <span className={s.noPhoto}>Photo coming soon</span>
              )}
            </span>
            <span className={s.body}>
              <span className={s.style}>{p.style}</span>
              <span className={s.name}>{p.name}</span>
              <span className={s.row}>
                <span className={s.price}>Call For Price</span>
                <span className={s.details}>View details&nbsp;&nbsp;↗</span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
