import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Form from '@/components/forms/Form';
import { EMAIL, LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Custom Order Form | Diamond Emotions',
  description: 'Submit your order for custom jewelry. Our staff will follow up within 24 business hours to confirm the details with you.',
  alternates: { canonical: LINKS.customOrder },
};

// Choices from the old site's custom order form
const METAL_COLORS = ['White', 'Yellow', 'Rose', 'White & Yellow', 'Other'];

const STEPS = [
  { n: '01', title: 'Drawing', text: 'Send a sketch, a photo or a style number to start from — or we’ll draw it for you.' },
  { n: '02', title: 'CAD', text: 'Approve a detailed Computer-Aided Design with your customer before anything is made.' },
  { n: '03', title: 'Masterpiece', text: 'We craft the finished piece and ship it to your store.' },
];

export default function CustomOrderPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Custom', href: LINKS.custom }, { label: 'Custom Order Form' }]}
        title="Custom Order Form"
        text="Please submit your order for custom jewelry through this form and someone from our staff will follow up within 24 business hours to confirm the details with you."
        image="/images/sketch.jpg"
      >
        <a href="#order" className="btn btn-sm btn-dark">
          Start Your Order
        </a>
        <a href={PHONE_HREF} className="btn btn-sm btn-outline">
          Call {PHONE}
        </a>
      </PageIntro>

      <section className={l.section} id="order">
        <div className={l.split}>
          <Form
            form="custom-order"
            submitLabel="Submit Custom Order"
            success="Thank you — your custom order has been received. Our staff will follow up within 24 business hours to confirm the details with you."
            prefillFromQuery={['style']}
            sections={[
              {
                fields: [
                  { name: 'name', label: 'Your Name', required: true, autoComplete: 'name', placeholder: 'Enter your name' },
                  { name: 'account', label: 'Account Number', placeholder: 'Enter your account number' },
                ],
              },
              {
                title: 'Product Information',
                fields: [
                  { name: 'style', label: 'Style #', placeholder: 'e.g. ER9289' },
                  {
                    name: 'stone_shape',
                    label: 'Stone Shape',
                    type: 'select',
                    options: ['Round', 'Princess', 'Emerald', 'Oval', 'Cushion', 'Pear', 'Marquise', 'Multiple Center Shape', 'Other'],
                  },
                  { name: 'finger_size', label: 'Finger Size' },
                  { name: 'stone_size', label: 'Stone Size' },
                  { name: 'metal_type', label: 'Metal Type', type: 'select', options: ['10Kt', '14Kt', '18Kt', 'Platinum', 'Silver'] },
                  { name: 'stone_quality', label: 'Stone Quality' },
                  { name: 'metal_color', label: 'Metal Color', type: 'select', options: METAL_COLORS },
                  { name: 'metal_color_2', label: 'Metal Color 2', type: 'select', options: METAL_COLORS },
                  { name: 'stone_info', label: 'Stone Information', type: 'textarea' },
                  { name: 'instructions', label: 'Special Instructions', type: 'textarea' },
                ],
              },
              {
                title: 'Ordered For',
                fields: [
                  {
                    name: 'store',
                    label: 'Store / Company Name',
                    required: true,
                    wide: true,
                    autoComplete: 'organization',
                    placeholder: 'Enter your store or company name',
                  },
                  { name: 'email', label: 'Email Address', type: 'email', required: true, autoComplete: 'email', placeholder: 'you@yourstore.com' },
                  { name: 'phone', label: 'Phone Number', type: 'tel', required: true, autoComplete: 'tel', placeholder: 'Your phone number' },
                ],
              },
              {
                title: 'Attachment',
                fields: [{ name: 'attachments', label: 'Sketches, photos or CAD files', type: 'file', accept: 'image/*,.pdf' }],
              },
            ]}
          />
          <aside className={l.aside}>
            <h2 className={l.asideTitle}>How It Works</h2>
            <ol className={l.toc}>
              {STEPS.map((st) => (
                <li key={st.n} style={{ padding: '8px 0' }}>
                  <strong style={{ color: '#171b18' }}>
                    {st.n} &nbsp;{st.title}
                  </strong>
                  <br />
                  {st.text}
                </li>
              ))}
            </ol>
            <div className={l.buttons}>
              <Link href={LINKS.customProcess} className="btn btn-sm btn-outline">
                Custom Design Process
              </Link>
            </div>
            <p>
              Questions? Call <a href={PHONE_HREF}>{PHONE}</a> or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
