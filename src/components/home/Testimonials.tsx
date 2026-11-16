'use client';

import { LINKS } from '@/lib/links';
import { useScroller } from './useScroller';
import c from './Carousel.module.css';
import s from './Testimonials.module.css';

// Reviewer names and stores are the design's sample content; replace with real Google reviews.
const REVIEWS = [
  {
    name: 'Dr. Emily Carter',
    store: 'Brooks Jewelry Co. · Illinois',
    quote:
      '“Diamond Emotions has helped us offer our customers beautiful bridal designs and personalized options. Their team makes it easy to find the right piece for every customer.”',
  },
  {
    name: 'Dr. Michael Thompson',
    store: 'Reynolds Jewelers · Ohio',
    quote:
      '“Having access to custom jewelry options gives us more ways to serve our customers. The ability to help someone bring a unique vision to life makes the experience special.”',
  },
  {
    name: 'Dr. Sarah Johnson',
    store: 'Mitchell Fine Jewelry · Michigan',
    quote:
      '“We value working with a team that understands the jewelry business and the importance of customer relationships. Diamond Emotions is a valuable resource for our store.”',
  },
];

const AVATARS = [1, 2, 3, 4, 5].map((n) => `/images/avatar-${n}.jpg`);

export default function Testimonials() {
  const { ref, prev, next, progress } = useScroller<HTMLUListElement>();

  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.head}>
          <div className={s.copy}>
            <p className={s.eyebrow}>Retailer Testimonials</p>
            <h2 className={s.title}>What Our Retailers Say</h2>
            <p className={s.sub}>Discover designs made for the beginning of forever</p>
          </div>
          <div className={c.arrows}>
            <a href={LINKS.googleReviews} className={c.viewAll} target="_blank" rel="noopener noreferrer">
              View All On <span className={c.mark}>Google</span>
            </a>
            <button type="button" className={`${c.arrow} ${c.prev}`} onClick={prev} aria-label="Previous reviews">
              <img src="/images/icons/arrow-24.svg" alt="" />
            </button>
            <button type="button" className={c.arrow} onClick={next} aria-label="Next reviews">
              <img src="/images/icons/arrow-24.svg" alt="" />
            </button>
          </div>
        </div>

        <ul ref={ref} className={`${c.track} ${s.track}`}>
          <li className={`${s.item} ${s.rating}`}>
            <div className={s.score}>
              <p className={s.big}>
                4.9<span>/5</span>
              </p>
              <p className={s.serving}>We have been serving 100+ retailers</p>
            </div>
            <div className={s.trust}>
              <img src="/images/logo-white.png" alt="Diamond Emotions" className={s.logo} />
              <div className={s.trustRow}>
                <div className={s.avatars} aria-hidden>
                  {AVATARS.map((a) => (
                    <img key={a} src={a} alt="" />
                  ))}
                </div>
                <div className={s.trustText}>
                  <img src="/images/icons/stars-sm.svg" alt="5 stars" className={s.starsSm} />
                  <p>
                    Trusted by <strong>Retailers</strong>
                  </p>
                </div>
              </div>
            </div>
          </li>

          {REVIEWS.map((r) => (
            <li key={r.name} className={`${s.item} ${s.review}`}>
              <div className={s.reviewHead}>
                <div className={s.who}>
                  <p className={s.name}>{r.name}</p>
                  <p className={s.store}>{r.store}</p>
                  <img src="/images/icons/stars.svg" alt="5 out of 5 stars" className={s.stars} />
                </div>
                <img src="/images/google.png" alt="Google review" className={s.google} />
              </div>
              <p className={s.quote}>{r.quote}</p>
            </li>
          ))}
        </ul>

        <div className={c.progress} style={{ background: 'var(--white)' }}>
          <span className={c.thumb} style={{ left: `calc((100% - 66.8px) * ${progress})` }} />
        </div>
      </div>
    </section>
  );
}
