'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import s from './Lightbox.module.css';

export type LightboxImage = { src: string; alt: string; caption?: string; note?: string };

type Props = {
  images: LightboxImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

type Zoom = { s: number; x: number; y: number };
const NONE: Zoom = { s: 1, x: 0, y: 0 };
const MAX = 4;
const CLICK_ZOOM = 2.5;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Full-screen image viewer.
 * Move: arrows, ← →, swipe. Zoom: click/tap a spot, mouse wheel, + / − buttons or keys (0 resets);
 * drag to pan a zoomed image. Close: ×, Esc or the backdrop.
 */
export default function Lightbox({ images, index, onIndex, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<{ x: number; y: number; zx: number; zy: number; moved: boolean } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState<Zoom>(NONE);
  const [dragging, setDragging] = useState(false);
  const count = images.length;
  const img = images[index];

  const go = useCallback((step: number) => onIndex((index + step + count) % count), [index, count, onIndex]);

  /** zoom to `next` (or a function of the current scale), keeping the point under (cx, cy) in place */
  const zoomTo = useCallback((next: number | ((scale: number) => number), cx?: number, cy?: number) => {
    const el = imgRef.current;
    if (!el) return;
    setZoom((z) => {
      const scale = clamp(typeof next === 'function' ? next(z.s) : next, 1, MAX);
      if (scale === 1) return NONE;
      const r = el.getBoundingClientRect(); // includes the current transform
      const w = r.width / z.s; // untransformed size
      const h = r.height / z.s;
      const c0x = r.left + r.width / 2 - z.x; // untransformed centre (scaling is about the centre)
      const c0y = r.top + r.height / 2 - z.y;
      const px = cx ?? r.left + r.width / 2;
      const py = cy ?? r.top + r.height / 2;
      // the image point under the pointer, in untransformed pixels from the centre
      const ix = (px - c0x - z.x) / z.s;
      const iy = (py - c0y - z.y) / z.s;
      const maxX = (w * (scale - 1)) / 2;
      const maxY = (h * (scale - 1)) / 2;
      return {
        s: scale,
        x: clamp(px - c0x - ix * scale, -maxX, maxX),
        y: clamp(py - c0y - iy * scale, -maxY, maxY),
      };
    });
  }, []);

  // pan a zoomed image, keeping its edges from leaving the frame
  const panTo = useCallback((x: number, y: number) => {
    const el = imgRef.current;
    if (!el) return;
    setZoom((z) => {
      const r = el.getBoundingClientRect();
      const maxX = ((r.width / z.s) * (z.s - 1)) / 2;
      const maxY = ((r.height / z.s) * (z.s - 1)) / 2;
      return { ...z, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
    });
  }, []);

  // focus, scroll lock; focus goes back to whatever opened the viewer
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && count > 1) go(1);
      else if (e.key === 'ArrowLeft' && count > 1) go(-1);
      else if (e.key === '+' || e.key === '=') zoomTo((z) => z * 1.5);
      else if (e.key === '-' || e.key === '_') zoomTo((z) => z / 1.5);
      else if (e.key === '0') setZoom(NONE);
      else if (e.key === 'Tab') {
        // keep Tab inside the viewer
        const items = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, onClose, count, zoomTo]);

  // a new image starts unzoomed
  useEffect(() => {
    setLoaded(false);
    setZoom(NONE);
  }, [img?.src]);

  // mouse wheel zooms around the pointer (a non-passive listener, so the page doesn't scroll)
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0025);
      zoomTo((z) => z * factor, e.clientX, e.clientY);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomTo, img?.src]);

  // preload the neighbours so arrows feel instant
  useEffect(() => {
    if (count < 2) return;
    for (const i of [(index + 1) % count, (index - 1 + count) % count]) new Image().src = images[i].src;
  }, [index, count, images]);

  if (!img) return null;
  const zoomed = zoom.s > 1;

  return createPortal(
    <div
      ref={dialogRef}
      className={s.root}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={s.top}>
        <p className={s.counter} aria-live="polite">
          {count > 1 ? `${index + 1} / ${count}` : ''}
        </p>
        <div className={s.tools}>
          <div className={s.zoomBar} role="group" aria-label="Zoom">
            <button
              type="button"
              className={s.tool}
              aria-label="Zoom out"
              disabled={!zoomed}
              onClick={() => zoomTo((z) => z / 1.5)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path d="M4 9h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className={s.level}
              aria-label={zoomed ? 'Reset zoom' : 'Zoom level'}
              onClick={() => setZoom(NONE)}
            >
              {Math.round(zoom.s * 100)}%
            </button>
            <button
              type="button"
              className={s.tool}
              aria-label="Zoom in"
              disabled={zoom.s >= MAX}
              onClick={() => zoomTo((z) => z * 1.5)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path d="M4 9h10M9 4v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <button ref={closeRef} type="button" className={s.close} aria-label="Close image viewer" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={s.stage}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' && !zoomed) swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start || count < 2 || zoomed) return;
          const dx = e.clientX - start.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - start.y)) go(dx < 0 ? 1 : -1);
        }}
      >
        {count > 1 && (
          <button type="button" className={`${s.arrow} ${s.prev}`} aria-label="Previous image" onClick={() => go(-1)}>
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
              <path d="M14 4l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <figure className={s.figure}>
          <div className={s.frame}>
            <img
              ref={imgRef}
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`${s.image} ${loaded ? s.loaded : ''} ${zoomed ? s.zoomed : ''} ${dragging ? s.dragging : ''}`}
              style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})` }}
              onLoad={() => setLoaded(true)}
              draggable={false}
              onPointerDown={(e) => {
                if (!zoomed) return;
                e.stopPropagation();
                e.currentTarget.setPointerCapture(e.pointerId);
                drag.current = { x: e.clientX, y: e.clientY, zx: zoom.x, zy: zoom.y, moved: false };
                setDragging(true);
              }}
              onPointerMove={(e) => {
                const d = drag.current;
                if (!d) return;
                const dx = e.clientX - d.x;
                const dy = e.clientY - d.y;
                if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
                panTo(d.zx + dx, d.zy + dy);
              }}
              onPointerUp={(e) => {
                const d = drag.current;
                drag.current = null;
                setDragging(false);
                if (d) e.stopPropagation();
                // a click (not a drag) toggles zoom at that spot
                if (!d?.moved) {
                  if (zoomed) setZoom(NONE);
                  else zoomTo(CLICK_ZOOM, e.clientX, e.clientY);
                }
              }}
              onPointerCancel={() => {
                drag.current = null;
                setDragging(false);
              }}
            />
          </div>
          {(img.caption || img.note) && (
            <figcaption className={s.caption}>
              {img.caption && <span className={s.captionTitle}>{img.caption}</span>}
              {img.note && <span className={s.captionNote}>{img.note}</span>}
            </figcaption>
          )}
        </figure>
        {count > 1 && (
          <button type="button" className={`${s.arrow} ${s.next}`} aria-label="Next image" onClick={() => go(1)}>
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
              <path d="M8 4l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <p className={s.help} aria-hidden>
        {zoomed ? 'Drag to move · Click to zoom out' : 'Click or scroll to zoom'}
      </p>

      {count > 1 && count <= 24 && (
        <div className={s.thumbs}>
          {images.map((t, i) => (
            <button
              key={t.src}
              type="button"
              className={`${s.thumb} ${i === index ? s.thumbOn : ''}`}
              aria-label={`Image ${i + 1} of ${count}`}
              aria-current={i === index}
              onClick={() => onIndex(i)}
            >
              <img src={t.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
