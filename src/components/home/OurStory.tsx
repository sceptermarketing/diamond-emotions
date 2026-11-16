import Link from 'next/link';
import { LINKS } from '@/lib/links';
import s from './OurStory.module.css';

export default function OurStory() {
  return (
    <section className={s.section}>
      <img src="/images/story.jpg" alt="" className={s.photo} loading="lazy" />
      <div className={s.panel}>
        <p className="eyebrow">Our Story</p>
        <h2 className={`h2 ${s.title}`}>Founded By a Retailer, for Retailers</h2>
        <div className={s.text}>
          <p>
            Rick Gouthro decided on a career in jewelry while ring shopping with Gerri in college. He spent years on the
            retail side — from store manager to director of stores — then led sales and marketing for a major fine
            jewelry manufacturer.
          </p>
          <p>
            In 2009, Rick and Gerri founded Diamond Emotions on a simple belief: it&apos;s not just about the sale,
            it&apos;s about the customer. Today we partner with independent jewelers across the United States and Canada.
          </p>
        </div>
        <hr className={s.rule} />
        <blockquote className={s.quote}>
          <p>“It&apos;s All About Emotion.”</p>
        </blockquote>
        <p className={s.by}>Rick Gouthro, President</p>
        <Link href={LINKS.about} className="btn btn-lg btn-dark">
          Read Our Story
          <span className={s.arrow} aria-hidden>
            <img src="/images/icons/arrow-white.svg" alt="" />
          </span>
        </Link>
      </div>
    </section>
  );
}
