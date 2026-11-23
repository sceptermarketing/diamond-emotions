import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import Crumbs from '@/components/layout/Crumbs';
import Form from '@/components/forms/Form';
import { LINKS, PHONE_DISPLAY, PHONE_HREF } from '@/lib/links';
import s from '@/components/content/CustomProcess.module.css';

export const metadata: Metadata = {
  title: 'Custom Jewelry Design Process | Diamond Emotions',
  description:
    'How a Diamond Emotions custom piece is made: a drawing of your idea, a CAD for approval, then the finished masterpiece in white, rose, yellow or two-tone gold.',
  alternates: { canonical: LINKS.customProcess },
};

// Copy and images from the old site's "Custom Design Process" page
const STEPS = [
  {
    id: 'drawing',
    title: 'Drawing',
    image: '/content/2018/04/ER9396-Drawing.webp',
    alt: 'Hand drawing of custom engagement ring ER9396',
    text: 'We are not asking for you to be a Picasso or Van Gogh, we just want you to have an imagination. If you can visualize the art in your mind, we can help bring it to life. Send us a drawing of your idea or let us draw it for you. Now, sit back and relax, and watch your imagination soar.',
  },
  {
    id: 'cad',
    title: 'CAD',
    image: '/content/2018/04/ER9396-CAD.webp',
    alt: 'Computer-aided design (CAD) sheet for ring ER9396',
    text: 'Once you’ve approved the drawing, we will create a Computer-Aided Design (CAD) and show you the specs of your work of art. This will help enhance your realistic views on the piece soon coming to life. Isn’t technology great?',
  },
  {
    id: 'masterpiece',
    title: 'Masterpiece',
    image: '/content/2018/04/ER9396-1024x1024.webp',
    alt: 'Finished custom engagement ring ER9396',
    text: 'You’ve done it! You have created your first masterpiece. From an idea in your mind, to a drawing and CAD, the illusion has now become reality. Congratulations, you are now a jewelry designer.',
  },
];

// Figma "Custom Design Process / Desktop" (916:461)
export default function CustomProcessPage() {
  return (
    <PageShell cta={false}>
      {/* 01 · Hero: copy (720) + design bench photo (720) */}
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <Crumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Custom', href: LINKS.custom }, { label: 'Custom Design Process' }]}
            className={s.crumbs}
          />
          <div className={s.heroText}>
            <p className={s.eyebrow}>Custom Design Process</p>
            <h1 className={s.heroTitle}>What Can You Imagine?</h1>
            <a href="#how-it-works" className="btn btn-sm btn-dark">
              See How It Works
            </a>
          </div>
        </div>
        <div className={s.heroPhoto}>
          <img src="/images/sketch.jpg" alt="Ring designs sketched at a jeweler's bench" fetchPriority="high" />
        </div>
      </section>

      {/* 02 · How it Works: the old site's collage + links to the three steps */}
      <section id="how-it-works" className={s.how} aria-labelledby="how-title">
        <img
          src="/content/2018/04/Custom-Design-Process.webp"
          alt="Are you creative? We are. Diamond Emotions custom design: drawings, CAD and the finished ring ER9396"
          width={1000}
          height={550}
          loading="lazy"
          className={s.howImage}
        />
        <div className={s.howIndex}>
          <h2 id="how-title" className={s.howTitle}>
            How it Works
          </h2>
          <ol className={s.stepLinks}>
            {STEPS.map((st, i) => (
              <li key={st.id}>
                <a href={`#step-${st.id}`}>
                  Step {i + 1}: {st.title}
                  <img src="/images/icons/arrow-step.svg" alt="" width={20} height={20} />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 · Drawing, CAD and masterpiece */}
      <section className={s.stages} aria-label="The three steps">
        <ol className={s.stageList}>
          {STEPS.map((st, i) => (
            <li key={st.id} id={`step-${st.id}`} className={s.stage}>
              <div className={s.stageImage}>
                <img src={st.image} alt={st.alt} loading="lazy" />
              </div>
              <h3 className={s.stageTitle}>
                Step {i + 1}: {st.title}
              </h3>
              <p className={s.stageText}>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 04 · Metal options */}
      <section className={s.metals} aria-labelledby="color-title">
        <div className={s.metalsCopy}>
          <h2 id="color-title" className={s.metalsTitle}>
            Which Colors Do You Want?
          </h2>
          <p className={s.body}>
            Ambitious? Why not create your own special identity by choosing a different color metal! Whether it’s white, rose,
            yellow or two-tone, we will help create your masterpiece however you imagine it.
          </p>
          <Link href={LINKS.bridal} className="btn btn-sm btn-dark">
            Find Your Ring
          </Link>
        </div>
        <div className={s.metalsImage}>
          <img
            src="/images/custom/ring-colors.webp"
            alt="Engagement ring ER9418 in white, rose and yellow gold"
            width={1400}
            height={867}
            loading="lazy"
          />
        </div>
      </section>

      {/* 05 · View Our Designs */}
      <section className={s.band} aria-labelledby="designs-title">
        <img src="/images/cta-ring.jpg" alt="" className={s.bandBg} loading="lazy" />
        <div className={s.bandShade} aria-hidden />
        <div className={s.bandInner}>
          <h2 id="designs-title" className={s.bandTitle}>
            Check out our new custom design pieces!
          </h2>
          <p className={`${s.eyebrow} ${s.eyebrowLight}`}>Find your creativity.</p>
          <Link href={LINKS.custom} className="btn btn-sm btn-light">
            View Our Designs
          </Link>
        </div>
      </section>

      {/* 06 · Custom inquiry */}
      <section className={s.inquiry} aria-labelledby="ask-title">
        <div className={s.inquiryHead}>
          <p className={s.eyebrow}>Custom Design Process</p>
          <h2 id="ask-title" className={s.inquiryTitle}>
            Send a Custom Design Inquiry
          </h2>
        </div>
        <div className={s.inquiryGrid}>
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
                    { name: 'subject', label: 'Subject', required: true, wide: true, placeholder: 'Custom design' },
                    { name: 'message', label: 'Message', type: 'textarea', required: true },
                  ],
                },
              ]}
            />
          </div>
          <aside className={s.call}>
            <p className={s.eyebrow}>For Independent Jewelers</p>
            <h3 className={s.callTitle}>Let’s Talk Custom Design.</h3>
            <p className={s.callText}>Have a drawing or a design question? Call us to talk through your request.</p>
            <a href={PHONE_HREF} className="btn btn-sm btn-dark">
              Call {PHONE_DISPLAY}
            </a>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
