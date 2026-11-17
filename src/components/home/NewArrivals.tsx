'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { LINKS } from '@/lib/links';
import type { Product } from '@/lib/collections';
import { useScroller } from './useScroller';
import c from './Carousel.module.css';
import s from './NewArrivals.module.css';

// Real styles from the catalogue (passed in by the home page). Until a style's photo is imported, its card
// shows the design's photo for that position (cards 2-4 are crops of one Figma image, new-sprite.jpg).
type Fallback = { img: string; crop?: CSSProperties };

const SPRITE = { top: 0, height: '100%', width: '344.68%' };

const FALLBACKS: Fallback[] = [
  { img: '/images/new-1.jpg' },
  { img: '/images/new-sprite.jpg', crop: { ...SPRITE, left: 0 } },
  { img: '/images/new-sprite.jpg', crop: { ...SPRITE, left: '-115.8%' } },
  { img: '/images/new-sprite.jpg', crop: { ...SPRITE, left: '-237.76%' } },
];

export default function NewArrivals({ products }: { products: Product[] }) {
  const { ref, prev, next, progress } = useScroller<HTMLUListElement>();

  return (
    <section className={s.section}>
      <div className={s.head}>
        <div className={s.copy}>
          <p className={s.eyebrow}>New Arrivals</p>
          <h2 className={s.title}>New To The Line</h2>
          <p className={s.sub}>Discover designs made for the beginning of forever</p>
        </div>
        <div className={c.arrows}>
          <Link href={LINKS.newArrivals} className={c.viewAll}>
            View <span className={c.mark}>All</span>
          </Link>
          <button type="button" className={`${c.arrow} ${c.prev}`} onClick={prev} aria-label="Previous products">
            <img src="/images/icons/arrow-24.svg" alt="" />
          </button>
          <button type="button" className={c.arrow} onClick={next} aria-label="Next products">
            <img src="/images/icons/arrow-24.svg" alt="" />
          </button>
        </div>
      </div>

      <ul ref={ref} className={`${c.track} ${s.track}`}>
        {products.map((p, i) => {
          const fallback = FALLBACKS[i % FALLBACKS.length];
          return (
            <li key={p.slug} className={s.item}>
              <Link href={p.href} className={s.card}>
                <span className={s.img}>
                  {p.image ? (
                    <img src={p.image} alt={p.alt} loading="lazy" className={s.photo} />
                  ) : (
                    <img
                      src={fallback.img}
                      alt=""
                      loading="lazy"
                      className={fallback.crop ? s.crop : undefined}
                      style={fallback.crop}
                    />
                  )}
                </span>
                <span className={s.code}>{p.style}</span>
                <span className={s.text}>{p.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={c.progress} style={{ background: 'var(--mist)' }}>
        <span className={c.thumb} style={{ left: `calc((100% - 66.8px) * ${progress})` }} />
      </div>
    </section>
  );
}
