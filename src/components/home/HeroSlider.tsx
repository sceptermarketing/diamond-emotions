'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import s from './Hero.module.css';

// The live site's home slider (Slider Revolution "Spring" set, uploads/2024/03/Diamonemotions-1…6).
// The printed DIAMOND EMOTIONS wordmark has been removed from these copies; the banners are 2.4:1 and
// the column is nearly square, so each one is cropped on its jewelry.
// The first slide is the site's own hero photo, kept on its Figma crop (figma: true).
type Slide = { src: string; alt: string; pos?: string; figma?: boolean };
const SLIDES: Slide[] = [
  { src: '/images/hero.jpg', alt: '', figma: true },
  { src: '/images/hero/slide-1.webp', alt: 'Emerald and ruby teardrop pendants among cherry blossoms', pos: '90% 50%' },
  { src: '/images/hero/slide-2.webp', alt: 'Sapphire-blue pendant and drop earrings with spring flowers', pos: '36% 50%' },
  { src: '/images/hero/slide-3.webp', alt: 'Hexagon sapphire earrings and necklace with red roses', pos: '64% 50%' },
  { src: '/images/hero/slide-4.webp', alt: 'Aquamarine pendant against a blue sky', pos: '74% 50%' },
  { src: '/images/hero/slide-5.webp', alt: 'Pearl earrings and pendant on wood with spring flowers', pos: '72% 50%' },
  { src: '/images/hero/slide-6.webp', alt: 'Garnet and amethyst halo pendants and earrings with daisies', pos: '22% 50%' },
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
            className={slide.figma ? s.figmaCrop : undefined}
            style={slide.pos ? { objectPosition: slide.pos } : undefined}
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
