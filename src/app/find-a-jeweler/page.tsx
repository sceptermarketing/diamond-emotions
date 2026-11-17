import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Form from '@/components/forms/Form';
import { EMAIL, LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Find a Diamond Emotions Jeweler Near You',
  description:
    'Diamond Emotions is sold only through independent jewelers. Tell us where you are and we will point you to an authorized jeweler near you.',
  alternates: { canonical: LINKS.findJeweler },
};

export default function FindJewelerPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Find a Jeweler' }]}
        title="Find a Jeweler"
        text="Diamond Emotions is sold only through independent jewelers. Tell us where you are and we’ll point you to an authorized jeweler near you."
        image="/images/collections/cathedral-hero.jpg"
      />
      <section className={l.section}>
        <div className={l.split}>
          <div>
            <div className={l.head}>
              <h2 className={l.heading}>Where Are You Shopping?</h2>
              <p className={l.lead}>
                Found a style you love? Include the style number and we’ll let you know which jeweler near you can show it to you.
              </p>
            </div>
            <Form
              form="find-a-jeweler"
              submitLabel="Find My Jeweler"
              success="Thank you — we’ll be in touch with an authorized jeweler near you."
              prefillFromQuery={['style']}
              sections={[
                {
                  fields: [
                    { name: 'name', label: 'Name', required: true, autoComplete: 'name' },
                    { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
                    { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
                    { name: 'location', label: 'City & State or ZIP', required: true, autoComplete: 'postal-code' },
                    { name: 'style', label: 'Style # you’re interested in', placeholder: 'e.g. ER9289' },
                    { name: 'message', label: 'Message', type: 'textarea' },
                  ],
                },
              ]}
            />
          </div>
          <aside className={l.aside}>
            <h2 className={l.asideTitle}>Prefer to Call?</h2>
            <p>
              Call <a href={PHONE_HREF}>{PHONE}</a> or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we’ll find a jeweler near you.
            </p>
            <h2 className={l.asideTitle}>Are You a Jeweler?</h2>
            <p>Carry Diamond Emotions in your store.</p>
            <div className={l.buttons}>
              <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-dark">
                Become a Retailer
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
