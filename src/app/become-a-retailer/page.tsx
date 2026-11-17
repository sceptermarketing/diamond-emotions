import type { Metadata } from 'next';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import RetailerSteps from '@/components/home/RetailerSteps';
import Form from '@/components/forms/Form';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Become a Retailer | Diamond Emotions Wholesale',
  description:
    'Apply to carry Diamond Emotions bridal and fashion jewelry. Wholesale only, with custom bridal, fast turnaround and industry-leading support.',
  alternates: { canonical: LINKS.becomeRetailer },
};

// "Reasons Diamond Emotions makes the perfect addition to your store", from the old site
const REASONS = [
  'Top quality bridal and fashion lines that are the perfect addition to any store’s display',
  'Custom bridal jewelry with fantastic turnaround times, made of high quality materials',
  'Industry-leading customer support. We love our customers, and we take very good care of them',
  'A customer portal you can show your customers with your markup, for easy selling',
  'Competitive prices for high-quality jewelry lines',
];

export default function BecomeRetailerPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'For Retailers', href: LINKS.forRetailers }, { label: 'Become a Retailer' }]}
        title="Become a Retailer"
        text="Simply provide some initial information below and our sales manager will follow up right away."
        image="/images/why-bridal.jpg"
      >
        <a href="#apply" className="btn btn-sm btn-dark">
          Apply Now
        </a>
        <a href={PHONE_HREF} className="btn btn-sm btn-outline">
          Call {PHONE}
        </a>
      </PageIntro>

      <section className={l.section}>
        <div className={l.head}>
          <h2 className={l.heading}>Why Jewelers Partner With Us</h2>
        </div>
        <ul className={l.checks}>
          {REASONS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <RetailerSteps />

      <section className={l.section} id="apply">
        <div className={l.head}>
          <h2 className={l.heading}>Retailer Application</h2>
          <p className={l.lead}>Diamond Emotions sells only through independent jewelers. Tell us about your store.</p>
        </div>
        <Form
          form="become-a-retailer"
          submitLabel="Submit Application"
          success="Thank you for applying. Our sales manager will be in touch shortly."
          sections={[
            {
              title: 'Your Store',
              fields: [
                { name: 'company', label: 'Company Name', required: true, autoComplete: 'organization' },
                { name: 'website', label: 'Company Website', type: 'url', placeholder: 'https://' },
                { name: 'address', label: 'Address of Store', required: true, wide: true, autoComplete: 'street-address' },
                { name: 'city', label: 'City', required: true, autoComplete: 'address-level2' },
                { name: 'state', label: 'State / Province', required: true, autoComplete: 'address-level1' },
                { name: 'zip', label: 'ZIP / Postal Code', required: true, autoComplete: 'postal-code' },
                { name: 'country', label: 'Country', type: 'select', options: ['United States', 'Canada', 'Other'], required: true },
              ],
            },
            {
              title: 'Contact',
              fields: [
                { name: 'contact', label: 'Contact Name', required: true, autoComplete: 'name' },
                { name: 'phone', label: 'Phone Number', type: 'tel', required: true, autoComplete: 'tel' },
                { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
              ],
            },
            {
              title: 'Billing & Shipping',
              fields: [
                { name: 'billing_name', label: 'Billing Name', required: true },
                {
                  name: 'billing_address',
                  label: 'Billing Address',
                  type: 'radio',
                  required: true,
                  options: ['Same as store address', 'Different address (enter below)'],
                },
                { name: 'billing_address_other', label: 'Billing address, if different', wide: true },
                {
                  name: 'shipping_address',
                  label: 'Shipping Address',
                  type: 'radio',
                  required: true,
                  options: ['Same as billing address', 'Different address (enter below)'],
                },
                { name: 'shipping_address_other', label: 'Shipping address, if different', wide: true },
              ],
            },
            {
              title: 'About Your Business',
              fields: [
                {
                  name: 'footprint',
                  label: 'Footprint (check the one that best applies)',
                  type: 'radio',
                  required: true,
                  options: [
                    'Independent – one store',
                    'Independent – more than one store',
                    'Regional – stores in more than one state',
                    'National – stores across the US',
                    'Direct – web or catalog only',
                    'International – non-US locations',
                  ],
                },
                {
                  name: 'heard_from',
                  label: 'How did you hear about us?',
                  type: 'checkboxes',
                  options: ['Print', 'Web', 'Jewelry Show', 'Event', 'Social Media', 'Other'],
                },
                { name: 'notes', label: 'Anything else we should know?', type: 'textarea' },
              ],
            },
          ]}
        />
      </section>
    </PageShell>
  );
}
