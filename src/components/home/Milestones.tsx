'use client';

import Link from 'next/link';
import { LINKS } from '@/lib/links';
import { useScroller } from './useScroller';
import c from './Carousel.module.css';
import s from './Milestones.module.css';

const CARDS = [
  { label: 'Color Fashion', img: '/images/ms-color-fashion.jpg', href: LINKS.colorFashion },
  { label: 'Sterling Silver', img: '/images/ms-sterling-silver.jpg', href: LINKS.sterlingSilver },
  { label: 'Diamond Fashion', img: '/images/ms-diamond-fashion.jpg', href: LINKS.diamondFashion },
  { label: 'Men’s Bands', img: '/images/ms-mens-bands.jpg', href: LINKS.mensBands },
  { label: 'Earrings', img: '/images/ms-earrings.jpg', href: LINKS.earrings },
];

export default function Milestones() {
  const { ref, prev, next } = useScroller<HTMLUListElement>();

  return (
    <section className={s.section}>
      <div className={s.head}>
        <div className={s.copy}>
          <h2 className={s.title}>Keep Them Coming Back For Every Milestone</h2>
          <p className={s.sub}>
            Fashion, color and sterling silver collections that bring the couples you sold an engagement ring to back
            for anniversaries, birthdays and gifts.
          </p>
        </div>
        <div className={c.arrows}>
          <button type="button" className={`${c.arrow} ${c.big} ${c.prev}`} onClick={prev} aria-label="Previous collections">
            <img src="/images/icons/arrow-32.svg" alt="" />
          </button>
          <button type="button" className={`${c.arrow} ${c.big}`} onClick={next} aria-label="Next collections">
            <img src="/images/icons/arrow-32.svg" alt="" />
          </button>
        </div>
      </div>

      <ul ref={ref} className={`${c.track} ${s.track}`}>
        {CARDS.map((card) => (
          <li key={card.label}>
            <Link href={card.href} className={s.card}>
              <img src={card.img} alt="" loading="lazy" />
              <span className={s.shade} aria-hidden />
              <span className={s.label}>{card.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
