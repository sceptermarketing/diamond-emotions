'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { LINKS } from '@/lib/links';
import { useScroller } from './useScroller';
import c from './Carousel.module.css';
import s from './NewArrivals.module.css';

// Cards 2-4 are crops of one Figma image (new-sprite.jpg); `crop` is the Figma fill crop.
type Product = { code: string; text: string; img: string; crop?: CSSProperties };

const SPRITE = { top: 0, height: '100%', width: '344.68%' };

const PRODUCTS: Product[] = [
  { code: 'ER9445', text: 'Elegant split shank prong set semi-engagement with an oval center.', img: '/images/new-1.jpg' },
  {
    code: 'ER9445',
    text: 'Elegant split shank prong set semi-engagement with an oval center.',
    img: '/images/new-sprite.jpg',
    crop: { ...SPRITE, left: 0 },
  },
  {
    code: 'ER9445',
    text: 'Elegant split shank prong set semi-engagement with an oval center.',
    img: '/images/new-sprite.jpg',
    crop: { ...SPRITE, left: '-115.8%' },
  },
  {
    code: 'ER9445',
    text: 'Elegant split shank prong set semi-engagement with an oval center.',
    img: '/images/new-sprite.jpg',
    crop: { ...SPRITE, left: '-237.76%' },
  },
];

export default function NewArrivals() {
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
        {PRODUCTS.map((p, i) => (
          <li key={i} className={s.item}>
            <Link href={LINKS.newArrivals} className={s.card}>
              <span className={s.img}>
                <img src={p.img} alt="" loading="lazy" className={p.crop ? s.crop : undefined} style={p.crop} />
              </span>
              <span className={s.code}>{p.code}</span>
              <span className={s.text}>{p.text}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={c.progress} style={{ background: 'var(--mist)' }}>
        <span className={c.thumb} style={{ left: `calc((100% - 66.8px) * ${progress})` }} />
      </div>
    </section>
  );
}
