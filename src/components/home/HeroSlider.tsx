'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import s from './Hero.module.css';

// Placeholder slides: all use the current hero photo until the client sends the others.
const SLIDES = [
  { src: '/images/hero.jpg', alt: '' },
  { src: '/images/hero.jpg', alt: '' },
  { src: '/images/hero.jpg', alt: '' },
  { src: '/images/hero.jpg', alt: '' },
  { src: '/images/hero.jpg', alt: '' },
];

const DELAY = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const count = SLIDES.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setTimeout(() => go(index + 1), DELAY);
    return () => window.clearTimeout(id);
  }, [index, paused, count, go]);

  return (
    <div
      className={s.right}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured jewelry"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={(e) => {
        startX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`${s.photo} ${i === index ? s.current : ''}`}
          aria-hidden={i !== index}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            draggable={false}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
          />
        </div>
      ))}
      <div className={s.shade} aria-hidden />
      <div className={s.dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? s.active : undefined}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
