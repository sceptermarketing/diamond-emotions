import Link from 'next/link';
import { LINKS } from '@/lib/links';
import s from './Hero.module.css';

export default function Hero() {
  return (
    <section className={s.hero}>
      <div className={s.left}>
        <div className={s.copy}>
          <p className={s.kicker}>Wholesale Bridal &amp; Fine Jewelry</p>
          <h1 className={s.title}>Sell more bridal. Say yes to every custom request.</h1>
          <p className={s.text}>
            Diamond Emotions designs engagement rings, wedding bands and fine jewelry for independent jewelers — and
            only for independent jewelers. We never sell to the public. We help you win the couple standing at your
            counter.
          </p>
          <div className={s.buttons}>
            <Link href={LINKS.becomeRetailer} className={`btn ${s.btn} btn-dark`}>
              Become a Retailer
            </Link>
            <Link href={LINKS.engagementRings} className={`btn ${s.btn} btn-outline`}>
              Explore the Collection
            </Link>
          </div>
          <p className={s.partner}>
            Already a partner? <Link href={LINKS.retailerLogin}>Log in to your retailer account →</Link>
          </p>
        </div>
      </div>

      <div className={s.right}>
        <div className={s.photo} aria-hidden>
          <img src="/images/hero.jpg" alt="" fetchPriority="high" />
        </div>
        <div className={s.shade} aria-hidden />
        <div className={s.dots} aria-hidden>
          <span />
          <span className={s.active} />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
