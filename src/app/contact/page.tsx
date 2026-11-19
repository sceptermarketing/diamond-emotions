import type { Metadata } from 'next';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Form from '@/components/forms/Form';
import { ADDRESS, EMAIL, FAX, HOURS, LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import l from '@/components/content/Layout.module.css';
import c from '@/components/content/Contact.module.css';

export const metadata: Metadata = {
  title: 'Contact Diamond Emotions | East Lansing, Michigan',
  description: `Call ${PHONE}, email ${EMAIL} or send us a message. Diamond Emotions, ${ADDRESS.join(', ')}.`,
  alternates: { canonical: LINKS.contact },
};

const Icon = ({ d }: { d: string }) => (
  <span className={c.icon} aria-hidden>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  </span>
);

export default function ContactPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        title="Contact Us"
        text="Our customer service team is here for any questions — pricing, orders, custom work or becoming a retailer."
        image="/content/2015/05/About-Us-slider-image.webp"
        imagePosition="50% 30%"
      >
        <a href={PHONE_HREF} className="btn btn-sm btn-dark">
          Call {PHONE}
        </a>
        <a href={`mailto:${EMAIL}`} className="btn btn-sm btn-outline">
          Email Us
        </a>
      </PageIntro>
      <section className={l.section}>
        <div className={l.split}>
          <div>
            <div className={l.head}>
              <h2 className={l.heading}>We Are Here To Help</h2>
              <p className={l.lead}>Fill out the form and our staff will be in touch.</p>
            </div>
            <Form
              form="contact"
              submitLabel="Send Message"
              success="Thank you — your message is on its way. Our team will be in touch shortly."
              sections={[
                {
                  fields: [
                    { name: 'name', label: 'Name', required: true, autoComplete: 'name' },
                    { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
                    { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
                    { name: 'store', label: 'Store / Company', autoComplete: 'organization' },
                    { name: 'subject', label: 'Subject', required: true, wide: true },
                    { name: 'message', label: 'Message', type: 'textarea', required: true },
                  ],
                },
              ]}
            />
          </div>
          <aside className={c.card} aria-labelledby="contact-card-title">
            <p className={c.eyebrow}>Diamond Emotions</p>
            <h2 id="contact-card-title" className={c.title}>
              Get In Touch
            </h2>
            <ul className={c.items}>
              <li className={c.item}>
                <Icon d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                <div>
                  <p className={c.label}>Visit Us</p>
                  <p className={c.value}>
                    {ADDRESS[0]}
                    <br />
                    {ADDRESS[1]}
                  </p>
                  <a className={c.link} href={LINKS.map} target="_blank" rel="noopener noreferrer">
                    Get directions ↗
                  </a>
                </div>
              </li>
              <li className={c.item}>
                <Icon d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                <div>
                  <p className={c.label}>Call Us</p>
                  <a className={c.value} href={PHONE_HREF}>
                    {PHONE}
                  </a>
                  <p className={c.note}>Fax: {FAX}</p>
                </div>
              </li>
              <li className={c.item}>
                <Icon d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6" />
                <div>
                  <p className={c.label}>Email Us</p>
                  <a className={c.value} href={`mailto:${EMAIL}`}>
                    {EMAIL}
                  </a>
                </div>
              </li>
              <li className={c.item}>
                <Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2" />
                <div>
                  <p className={c.label}>Business Hours</p>
                  <dl className={c.hours}>
                    {HOURS.map(([days, time]) => (
                      <div key={days}>
                        <dt>{days}</dt>
                        <dd>{time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>
      <section className={`${l.section} ${l.tight}`} aria-label="Map">
        <iframe className={l.map} src={LINKS.mapEmbed} title="Diamond Emotions on Google Maps" loading="lazy" />
      </section>
    </PageShell>
  );
}
