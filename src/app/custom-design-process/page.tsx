import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Form from '@/components/forms/Form';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
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

export default function CustomProcessPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Custom', href: LINKS.custom }, { label: 'Custom Design Process' }]}
        title="Custom Design Process"
        text="What can you imagine? Three steps take your customer’s idea from a drawing to a finished masterpiece."
        image="/content/2016/10/custom-main-banner2.webp"
        imagePosition="100% 50%"
      >
        <Link href={LINKS.customOrder} className="btn btn-sm btn-dark">
          Start a Custom Order
        </Link>
        <a href={PHONE_HREF} className="btn btn-sm btn-outline">
          Call {PHONE}
        </a>
      </PageIntro>

      {/* How it works */}
      <section className={s.section} aria-labelledby="how-title">
        <div className={s.how}>
          <img
            src="/content/2018/04/Custom-Design-Process.webp"
            alt="Are you creative? We are. Diamond Emotions custom design: drawings, CAD and the finished ring ER9396"
            width={1000}
            height={550}
            loading="lazy"
            className={s.howImage}
          />
          <div className={s.howCopy}>
            <p className={s.eyebrow}>Diamond Emotions Custom Design</p>
            <h2 id="how-title" className={s.heading}>
              How It Works
            </h2>
            <ol className={s.stepLinks}>
              {STEPS.map((st, i) => (
                <li key={st.id}>
                  <a href={`#step-${st.id}`}>
                    <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
                    Step {i + 1}: {st.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* the three steps */}
      <div className={s.tinted}>
        <section className={s.section} aria-label="The three steps">
          <ol className={s.steps}>
            {STEPS.map((st, i) => (
              <li key={st.id} id={`step-${st.id}`} className={s.step}>
                <div className={s.stepImage}>
                  <img src={st.image} alt={st.alt} loading="lazy" />
                </div>
                <div className={s.stepBody}>
                  <p className={s.stepNum}>Step {String(i + 1).padStart(2, '0')}</p>
                  <h3 className={s.stepTitle}>{st.title}</h3>
                  <p className={s.stepText}>{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Which color do you want? */}
      <section className={s.section} aria-labelledby="color-title">
        <div className={s.color}>
          <div className={s.colorCopy}>
            <h2 id="color-title" className={s.heading}>
              Which Color Do You Want?
            </h2>
            <p className={s.lead}>
              Ambitious? Why not create your own special identity by choosing a different color metal! Whether it’s white, rose,
              yellow or two-tone, we will help create your masterpiece however you imagine it.
            </p>
            <ul className={s.metals} aria-label="Metal colors">
              <li>
                <span className={s.swatch} style={{ background: 'linear-gradient(135deg,#f4f4f2,#c9cac7)' }} />
                White
              </li>
              <li>
                <span className={s.swatch} style={{ background: 'linear-gradient(135deg,#f3c9b6,#d9967c)' }} />
                Rose
              </li>
              <li>
                <span className={s.swatch} style={{ background: 'linear-gradient(135deg,#f6e3a1,#d6b35b)' }} />
                Yellow
              </li>
              <li>
                <span className={s.swatch} style={{ background: 'linear-gradient(135deg,#f4f4f2 50%,#d6b35b 50%)' }} />
                Two-tone
              </li>
            </ul>
            <Link href={LINKS.bridal} className="btn btn-sm btn-dark">
              Find Your Ring
            </Link>
          </div>
          <img
            src="/content/2018/04/ER9418-3-colors.webp"
            alt="Engagement ring ER9418 in white, rose and yellow gold"
            width={1600}
            height={991}
            loading="lazy"
            className={s.colorImage}
          />
        </div>
      </section>

      {/* Check out our new custom design pieces! */}
      <section className={s.band} aria-labelledby="designs-title">
        <div className={s.bandInner}>
          <h2 id="designs-title" className={s.bandTitle}>
            Check Out Our New Custom Design Pieces!
          </h2>
          <p className={s.bandText}>Find your creativity.</p>
          <Link href={LINKS.custom} className="btn btn-sm btn-light">
            View Our Designs
          </Link>
        </div>
      </section>

      {/* contact form, as on the old page */}
      <section className={s.section} aria-labelledby="ask-title">
        <div className={s.ask}>
          <div>
            <h2 id="ask-title" className={s.heading}>
              Have an Idea? Let’s Talk.
            </h2>
            <p className={s.lead}>
              Tell us about the piece your customer imagines, and our team will guide the design conversation. Ready to order?{' '}
              <Link href={LINKS.customOrder}>Use the Custom Order Form →</Link>
            </p>
          </div>
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
      </section>
    </PageShell>
  );
}
