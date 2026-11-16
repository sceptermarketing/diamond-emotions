import Link from 'next/link';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import s from './FinalCta.module.css';

export default function FinalCta() {
  return (
    <section className={s.section}>
      <img src="/images/cta-ring.jpg" alt="" className={s.bg} loading="lazy" />
      <div className={s.shade} aria-hidden />
      <div className={s.inner}>
        <div className={s.copy}>
          {/* Eyebrow text as in the design */}
          <p className={s.eyebrow}>Retailer Testimonials</p>
          <h2 className={s.title}>Ready To Sell More Bridal?</h2>
          <p className={s.sub}>Join the independent jewelers who count on Diamond Emotions for bridal, custom and fine jewelry.</p>
        </div>
        <div className={s.buttons}>
          <Link href={LINKS.becomeRetailer} className={`${s.btn} ${s.light}`}>
            <span className={s.icon} aria-hidden>
              <img src="/images/icons/badge-dark.svg" alt="" className={s.badge} />
            </span>
            Become a Retailer
          </Link>
          <a href={PHONE_HREF} className={`${s.btn} ${s.outline}`}>
            <span className={s.icon} aria-hidden>
              <img src="/images/icons/phone-white.svg" alt="" className={s.phone} />
            </span>
            Call {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}
