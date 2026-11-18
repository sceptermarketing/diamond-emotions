'use client';

import { useMemo, useState } from 'react';
import Lightbox from './Lightbox';
import s from './Gallery.module.css';

type Item = { slug: string; title: string; image: string | null; categories: string[] };

const PAGE = 24;

/** Custom-work gallery from the old site's portfolio, filterable by piece type */
export default function Gallery({ items, categories }: { items: Item[]; categories: string[] }) {
  const [cat, setCat] = useState('All');
  const [shown, setShown] = useState(PAGE);
  const [zoom, setZoom] = useState<number | null>(null); // index into `photos`
  const list = useMemo(() => (cat === 'All' ? items : items.filter((i) => i.categories.includes(cat))), [items, cat]);
  // the lightbox steps through every piece with a photo in the current filter
  const photos = useMemo(() => list.filter((i) => i.image), [list]);

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
            {i.image ? (
              <button
                type="button"
                className={s.photo}
                aria-label={`View custom piece ${i.title} larger`}
                onClick={() => setZoom(photos.indexOf(i))}
              >
                <img src={i.image} alt={`Custom piece ${i.title}`} loading="lazy" />
              </button>
            ) : (
              <span className={s.photo}>
                <span className={s.none}>Photo coming soon</span>
              </span>
            )}
            <span className={s.title}>{i.title}</span>
            <span className={s.cat}>{i.categories.join(', ')}</span>
          </li>
        ))}
      </ul>
      {zoom !== null && (
        <Lightbox
          images={photos.map((p) => ({
            src: p.image!,
            alt: `Custom piece ${p.title}`,
            caption: p.title,
            note: p.categories.join(', '),
          }))}
          index={zoom}
          onIndex={setZoom}
          onClose={() => setZoom(null)}
        />
      )}

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
