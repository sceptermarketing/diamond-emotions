import type { Metadata } from 'next';
import PageShell from '@/components/content/PageShell';
import Crumbs from '@/components/layout/Crumbs';
import Form from '@/components/forms/Form';
import { ADDRESS, EMAIL, FAX, LINKS, PHONE, PHONE_DISPLAY, PHONE_HREF } from '@/lib/links';
import s from '@/components/content/About.module.css';

export const metadata: Metadata = {
  title: 'About Diamond Emotions | Our History',
  description:
    'How Rick and Gerri Gouthro founded Diamond Emotions in 2009: a wholesale jewelry house founded by a retailer, for retailers, in East Lansing, Michigan.',
  alternates: { canonical: LINKS.about },
};

// Figma "About Us / Desktop • Full Source Copy" (910:1565): the old site's full history, Rick's message and the inquiry form
export default function AboutPage() {
  return (
    <PageShell cta={false}>
      {/* 01 · Our History */}
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <Crumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} className={s.crumbs} />
          <div className={s.heroText}>
            <p className={s.eyebrow}>About Diamond Emotions</p>
            <h1 className={s.heroTitle}>Our History</h1>
            <p className={s.body}>
              While in college, Rick and Gerri Gouthro went shopping for engagement rings and during this experience, Rick made a
              major decision in his life to pursue a career in the jewelry industry.
            </p>
          </div>
        </div>
        <div className={s.heroPhoto}>
          <img src="/images/story.jpg" alt="Engagement ring and wedding band on clasped hands" fetchPriority="high" />
        </div>
      </section>

      {/* 02 · Full founding history */}
      <section className={s.story}>
        <div className={s.storyLead}>
          <p className={s.eyebrow}>The Diamond Emotions Story</p>
          <h2 className={s.storyTitle}>Founded by a Retailer, for Retailers.</h2>
          <hr className={s.storyRule} />
          <p className={s.year}>2009</p>
        </div>
        <div className={s.storyText}>
          <p className={s.body}>
            Since 1976 through 2004, Rick was in the retail side of the business as a Store Manager, District manager and Director
            of Stores for a major corporation. In 1994, Rick made the decision to pursue a sales position for a major jewelry
            manufacturer of fine jewelry. Within a short time, Rick was promoted to Vice President of sales and marketing.
          </p>
          <p className={s.body}>
            In 2009, Rick and Gerri formed the company, Diamond Emotions, where it was not solely about the sales, but more about
            the customer. With years of watching the industry change, he and Gerri wanted to make sure the concept of ‘emotion’
            stayed strong throughout the company. “It’s all about emotion!” he would always say and until this day, it is still
            about that one idea, emotion.
          </p>
          <p className={s.body}>
            Four years later, Diamond Emotions has grown to be a major competitor throughout the Midwest and continues to expand
            across the United States and Canada. With exceptional craftsmanship, Diamond Emotions is proud to offer you the best
            quality in our products.
          </p>
        </div>
      </section>

      {/* 03 · Rick Gouthro's message */}
      <section className={s.message}>
        <div className={s.messagePhoto}>
          <img src="/images/sketch.jpg" alt="Ring designs sketched at a jeweler's bench" loading="lazy" />
        </div>
        <div className={s.messagePanel}>
          <p className={`${s.eyebrow} ${s.eyebrowLight}`}>A Message From Our President</p>
          <h2 className={s.messageTitle}>The Care Behind Every Design.</h2>
          <blockquote className={s.quote}>
            <p>
              “A great deal of devotion and care is put into the designs we offer to our customers. We take pride in the quality
              and selection we offer as well as the uniqueness of the designs.
            </p>
            <p>
              Diamond Emotions is shaping the jewelry industry as we know it. With new, creative designs from bridal to silver
              showcased in elegant displays, you will never be disappointed with what we can achieve. Expand your imagination and
              allow us to create the impossible with you.
            </p>
            <p>We look forward to serving you and becoming a part of your business.”</p>
          </blockquote>
          <p className={s.by}>-Rick Gouthro, President</p>
        </div>
      </section>

      {/* 04 · Our Company */}
      <section className={s.company}>
        <div className={s.companyHead}>
          <p className={s.eyebrow}>Contact Diamond Emotions</p>
          <h2 className={s.companyTitle}>Our Company</h2>
        </div>
        <div className={s.companyGrid}>
          <div className={s.formCard}>
            <Form
              form="contact"
              submitLabel="Submit"
              success="Thank you — your message is on its way. Our team will be in touch shortly."
              sections={[
                {
                  fields: [
                    { name: 'name', label: 'Name', required: true, autoComplete: 'name' },
                    { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
                    { name: 'subject', label: 'Subject', required: true, wide: true },
                    { name: 'message', label: 'Message', type: 'textarea', required: true },
                  ],
                },
              ]}
            />
          </div>
          <aside className={s.visit}>
            <h3 className={s.visitTitle}>Come See Us!</h3>
            <p className={s.address}>
              {ADDRESS[0]}
              <br />
              {ADDRESS[1]}
            </p>
            <hr className={s.visitRule} />
            <ul className={s.lines}>
              <li>
                tel: <a href={PHONE_HREF}>{PHONE}</a>
              </li>
              <li>fax: {FAX}</li>
              <li>
                email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* 05 · Retailer contact and call-to-order */}
      <section className={s.cta}>
        <img src="/images/cta-ring.jpg" alt="" className={s.ctaBg} loading="lazy" />
        <div className={s.ctaShade} aria-hidden />
        <div className={s.ctaInner}>
          <p className={`${s.eyebrow} ${s.eyebrowLight}`}>For Independent Jewelers</p>
          <h2 className={s.ctaTitle}>Let’s Talk Jewelry.</h2>
          <p className={s.ctaText}>Have a question about the collection, a wholesale order or a custom design? Give us a call.</p>
          <a href={PHONE_HREF} className={s.ctaBtn}>
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
