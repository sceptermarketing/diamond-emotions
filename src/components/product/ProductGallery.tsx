'use client';

import { useState, type PointerEvent } from 'react';
import Lightbox from '@/components/content/Lightbox';
import s from './ProductDetail.module.css';

type Photo = { src: string; alt: string };

export default function ProductGallery({ photos, style }: { photos: Photo[]; style: string }) {
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false); // full-screen viewer
  const [lens, setLens] = useState(false); // hover magnifier (mouse only)
  const photo = photos[current];

  // the magnified photo follows the pointer: its zoom origin is where the pointer is
  const follow = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className={s.gallery}>
      <div className={s.main}>
        {photo ? (
          <button
            type="button"
            className={`${s.zoom} ${lens ? s.lensOn : ''}`}
            aria-label={`View ${style} photo ${current + 1} larger`}
            onClick={() => {
              setLens(false);
              setZoom(true);
            }}
            onPointerEnter={(e) => {
              follow(e);
              if (e.pointerType === 'mouse') setLens(true);
            }}
            onPointerMove={follow}
            onPointerLeave={() => setLens(false)}
          >
            <img src={photo.src} alt={photo.alt || style} fetchPriority="high" />
            <span className={s.zoomHint} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M7 12.5A5.5 5.5 0 1 0 7 1.5a5.5 5.5 0 0 0 0 11zM14.5 14.5l-3.6-3.6M7 4.5v5M4.5 7h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <span className={s.hintMouse}>Hover to zoom · Click to enlarge</span>
              <span className={s.hintTouch}>Tap to enlarge</span>
            </span>
          </button>
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
      {zoom && (
        <Lightbox
          images={photos.map((p, i) => ({ src: p.src, alt: p.alt || `${style} photo ${i + 1}`, caption: style }))}
          index={current}
          onIndex={setCurrent}
          onClose={() => setZoom(false)}
        />
      )}
    </div>
  );
}
