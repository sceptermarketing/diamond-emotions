'use client';

import { useMemo, useState } from 'react';
import s from './Gallery.module.css';

type Item = { slug: string; title: string; image: string | null; categories: string[] };

const PAGE = 24;

/** Custom-work gallery from the old site's portfolio, filterable by piece type */
export default function Gallery({ items, categories }: { items: Item[]; categories: string[] }) {
  const [cat, setCat] = useState('All');
  const [shown, setShown] = useState(PAGE);
  const list = useMemo(() => (cat === 'All' ? items : items.filter((i) => i.categories.includes(cat))), [items, cat]);

  return (
    <div className={s.wrap}>
      <div className={s.filters} role="group" aria-label="Filter custom pieces">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            className={`${s.chip} ${cat === c ? s.on : ''}`}
            onClick={() => {
              setCat(c);
              setShown(PAGE);
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className={s.grid}>
        {list.slice(0, shown).map((i) => (
          <li key={i.slug} className={s.item}>
            <span className={s.photo}>
              {i.image ? <img src={i.image} alt={`Custom piece ${i.title}`} loading="lazy" /> : <span className={s.none}>Photo coming soon</span>}
            </span>
            <span className={s.title}>{i.title}</span>
            <span className={s.cat}>{i.categories.join(', ')}</span>
          </li>
        ))}
      </ul>
      <div className={s.more}>
        <p aria-live="polite">
          Showing {Math.min(shown, list.length)} of {list.length} pieces
        </p>
        {shown < list.length && (
          <button type="button" className={s.load} onClick={() => setShown((n) => n + PAGE)}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
