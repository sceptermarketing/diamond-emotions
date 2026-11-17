'use client';

import { useState } from 'react';
import s from './ProductDetail.module.css';

type Photo = { src: string; alt: string };

export default function ProductGallery({ photos, style }: { photos: Photo[]; style: string }) {
  const [current, setCurrent] = useState(0);
  const photo = photos[current];

  return (
    <div className={s.gallery}>
      <div className={s.main}>
        {photo ? (
          <img src={photo.src} alt={photo.alt || style} fetchPriority="high" />
        ) : (
          <span className={s.noPhoto}>Photo coming soon</span>
        )}
      </div>
      {photos.length > 1 && (
        <ul className={s.thumbs} aria-label="Product photos">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                className={`${s.thumb} ${i === current ? s.thumbOn : ''}`}
                aria-label={`Photo ${i + 1} of ${photos.length}`}
                aria-current={i === current}
                onClick={() => setCurrent(i)}
              >
                <img src={p.src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
