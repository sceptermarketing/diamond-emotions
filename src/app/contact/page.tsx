import type { Metadata } from 'next';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Form from '@/components/forms/Form';
import { ADDRESS, EMAIL, FAX, HOURS, LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Contact Diamond Emotions | East Lansing, Michigan',
  description: `Call ${PHONE}, email ${EMAIL} or send us a message. Diamond Emotions, ${ADDRESS.join(', ')}.`,
  alternates: { canonical: LINKS.contact },
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        title="Contact Us"
        text="Our customer service team is here for any questions — pricing, orders, custom work or becoming a retailer."
      />
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
          <aside className={l.aside}>
            <dl className={l.details}>
              <div>
                <dt>Visit</dt>
                <dd>
                  {ADDRESS[0]}
                  <br />
                  {ADDRESS[1]}
                  <br />
                  <a href={LINKS.map} target="_blank" rel="noopener noreferrer">
                    Get directions →
                  </a>
                </dd>
              </div>
              <div>
                <dt>Call</dt>
                <dd>
                  <a href={PHONE_HREF}>{PHONE}</a>
                  <br />
                  Fax: {FAX}
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </dd>
              </div>
              <div>
                <dt>Business Hours</dt>
                <dd className={l.hours}>
                  {HOURS.map(([days, time]) => (
                    <span key={days} style={{ display: 'contents' }}>
                      <span>{days}</span>
                      <span>{time}</span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
      <section className={`${l.section} ${l.tight}`} aria-label="Map">
        <iframe className={l.map} src={LINKS.mapEmbed} title="Diamond Emotions on Google Maps" loading="lazy" />
      </section>
    </PageShell>
  );
}
