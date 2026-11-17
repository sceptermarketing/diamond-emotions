'use client';

import { useState } from 'react';
import s from './Faq.module.css';

// The design's first four questions (holding answers that send people to the team until the client sends
// theirs), then two from the old site's FAQ and Custom Order pages in place of the design's repeats.
const FAQS = [
  {
    q: 'What is the minimum order requirement for wholesale purchases?',
    a: 'Order requirements are set up with each retailer when the account is opened. Call us at 517.574.4209 and we will walk you through them.',
  },
  {
    q: 'How do wholesale pricing and payment terms work?',
    a: 'Wholesale pricing and terms are shared once you apply to become a retailer. Our team will go over them with you when you meet the line.',
  },
  {
    q: 'What is your process for shipping, returns, and damaged products?',
    a: 'Every order ships to your store. If anything arrives damaged or needs to come back, contact our team and we will take care of it.',
  },
  {
    q: 'How can I access your catalog and place a wholesale order?',
    a: 'Approved retailers log in to their retailer account to browse the full catalog and place orders. New to Diamond Emotions? Apply to become a retailer.',
  },
  {
    q: 'If we send a drawing, can you build the piece?',
    a: "Yes. Whether your customer is a beautiful painter or an artist of stick figures, we'll take the idea, recreate it as a drawing and CAD for approval, then bring it to life.",
  },
  {
    q: 'How do I place a custom order?',
    a: 'Submit the Custom Order Form with the style number or a sketch, metal and stone details. Our staff follows up within 24 business hours to confirm the details with you.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={s.section}>
      <div className={s.head}>
        <h2 className={s.title}>Frequently Asked Questions</h2>
        <p className={s.sub}>Have questions? We hope the answers below help clear things up.</p>
      </div>

      <div className={s.list}>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={`${s.item} ${isOpen ? s.open : ''}`}>
              <h3 className={s.qWrap}>
                <button
                  type="button"
                  className={s.q}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  id={`faq-q-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className={s.toggle} aria-hidden>
                    <img src="/images/icons/chevron-down.svg" alt="" />
                  </span>
                </button>
              </h3>
              <div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={s.a} hidden={!isOpen}>
                <p>{f.a}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={s.decor} aria-hidden>
        <div className={s.bracelet}>
          <img src="/images/bracelet.jpg" alt="" loading="lazy" />
        </div>
        <img src="/images/logo.png" alt="" className={s.logo} loading="lazy" />
      </div>
    </section>
  );
}
