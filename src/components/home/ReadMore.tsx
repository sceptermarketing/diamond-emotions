'use client';

import { useId, useState, type ReactNode } from 'react';
import s from './OurStory.module.css';

/** Shows `intro` and hides `more` behind a Read more / Read less button (the hidden part slides open) */
export default function ReadMore({ intro, more }: { intro: ReactNode; more: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className={s.readMore}>
      {intro}
      <div id={id} className={`${s.more} ${open ? s.moreOpen : ''}`} inert={!open}>
        <div className={s.moreInner}>{more}</div>
      </div>
      <button
        type="button"
        className={s.toggle}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Read less' : 'Read more'}
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className={open ? s.toggleUp : undefined}>
          <path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
