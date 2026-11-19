import Link from 'next/link';
import { LINKS } from '@/lib/links';
import ReadMore from './ReadMore';
import s from './OurStory.module.css';

/**
 * Photo + story panel. Home page: the short story and a link to About.
 * `full` (About page): the old site's whole "Our History" text, with Read more / Read less.
 */
export default function OurStory({ full = false }: { full?: boolean }) {
  return (
    <section className={s.section} id={full ? 'our-history' : undefined}>
      <div className={s.photo}>
        <img src="/images/story.jpg" alt="" loading="lazy" />
      </div>
      <div className={s.panel}>
        <p className="eyebrow">{full ? 'Our History' : 'Our Story'}</p>
        <h2 className={`h2 ${s.title}`}>Founded By A Retailer, For Retailers</h2>
        {full ? (
          <div className={s.text}>
            <ReadMore
              intro={
                <>
                  <p>
                    While in college, Rick and Gerri Gouthro went shopping for engagement rings and during this experience, Rick
                    made a major decision in his life to pursue a career in the jewelry industry.
                  </p>
                  <p>
                    Since 1976 through 2004, Rick was in the retail side of the business as a Store Manager, District manager and
                    Director of Stores for a major corporation. In 1994, Rick made the decision to pursue a sales position for a
                    major jewelry manufacturer of fine jewelry. Within a short time, Rick was promoted to Vice President of sales
                    and marketing.
                  </p>
                </>
              }
              more={
                <>
                  <p>
                    In 2009, Rick and Gerri formed the company, Diamond Emotions, where it was not solely about the sales, but
                    more about the customer. With years of watching the industry change, he and Gerri wanted to make sure the
                    concept of ‘emotion’ stayed strong throughout the company. “It’s all about emotion!” he would always say and
                    until this day, it is still about that one idea, emotion.
                  </p>
                  <p>
                    Four years later, Diamond Emotions has grown to be a major competitor throughout the Midwest and continues to
                    expand across the United States and Canada. With exceptional craftsmanship, Diamond Emotions is proud to offer
                    you the best quality in our products.
                  </p>
                  <blockquote className={s.letter}>
                    <p>
                      “A great deal of devotion and care is put into the designs we offer to our customers. We take pride in the
                      quality and selection we offer as well as the uniqueness of the designs.
                    </p>
                    <p>
                      Diamond Emotions is shaping the jewelry industry as we know it. With new, creative designs from bridal to
                      silver showcased in elegant displays, you will never be disappointed with what we can achieve. Expand your
                      imagination and allow us to create the impossible with you.
                    </p>
                    <p>We look forward to serving you and becoming a part of your business.”</p>
                  </blockquote>
                </>
              }
            />
          </div>
        ) : (
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
        )}
        <hr className={s.rule} />
        <blockquote className={s.quote}>
          <p>“It&apos;s All About Emotion.”</p>
        </blockquote>
        <p className={s.by}>Rick Gouthro, President</p>
        {!full && (
          <Link href={LINKS.about} className="btn btn-lg btn-dark">
            Read Our Story
            <span className={s.arrow} aria-hidden>
              <img src="/images/icons/arrow-white.svg" alt="" />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
