import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import Form from '@/components/forms/Form';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Custom Order Form | Diamond Emotions',
  description: 'Submit a custom jewelry order. Our staff will follow up within 24 business hours to confirm the details.',
  alternates: { canonical: LINKS.customOrder },
};

const METAL_COLORS = ['White', 'Yellow', 'Rose', 'White & Yellow', 'Other'];

export default function CustomOrderPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Custom', href: LINKS.custom }, { label: 'Custom Order Form' }]}
        title="Custom Order Form"
        text="Please submit your order for custom jewelry through this form and someone from our staff will follow up within 24 business hours to confirm the details with you."
        image="/images/sketch.jpg"
      />
      <section className={l.section}>
        <div className={l.split}>
          <Form
            form="custom-order"
            submitLabel="Submit Custom Order"
            success="Thank you — your custom order has been received. Our staff will follow up within 24 business hours to confirm the details."
            prefillFromQuery={['style']}
            sections={[
              {
                title: 'Your Store',
                fields: [
                  { name: 'name', label: 'Your Name', required: true, autoComplete: 'name' },
                  { name: 'account', label: 'Account Number' },
                  { name: 'store', label: 'Store / Company Name', required: true, autoComplete: 'organization' },
                  { name: 'email', label: 'Email Address', type: 'email', required: true, autoComplete: 'email' },
                  { name: 'phone', label: 'Phone Number', type: 'tel', required: true, autoComplete: 'tel' },
                ],
              },
              {
                title: 'The Piece',
                fields: [
                  { name: 'style', label: 'Style #', placeholder: 'e.g. ER9289' },
                  { name: 'finger_size', label: 'Finger Size' },
                  {
                    name: 'metal_type',
                    label: 'Metal Type',
                    type: 'select',
                    options: ['10Kt', '14Kt', '18Kt', 'Platinum', 'Silver'],
                  },
                  { name: 'metal_color', label: 'Metal Color', type: 'select', options: METAL_COLORS },
                  { name: 'metal_color_2', label: 'Second Metal Color', type: 'select', options: METAL_COLORS },
                ],
              },
              {
                title: 'Center Stone',
                fields: [
                  {
                    name: 'stone_shape',
                    label: 'Stone Shape',
                    type: 'select',
                    options: ['Round', 'Princess', 'Emerald', 'Oval', 'Cushion', 'Pear', 'Marquise', 'Multiple Center Shape', 'Other'],
                  },
                  { name: 'stone_size', label: 'Stone Size' },
                  { name: 'stone_quality', label: 'Stone Quality' },
                  { name: 'stone_info', label: 'Stone Information', type: 'textarea' },
                  { name: 'instructions', label: 'Special Instructions', type: 'textarea' },
                ],
              },
            ]}
          />
          <aside className={l.aside}>
            <h2 className={l.asideTitle}>How It Works</h2>
            <p>Send us a drawing, a photo or a style number to start from. We return a CAD for your approval, then craft the finished piece.</p>
            <div className={l.buttons}>
              <Link href={LINKS.customProcess} className="btn btn-sm btn-outline">
                Custom Design Process
              </Link>
            </div>
            <p>
              Questions? Call <a href={PHONE_HREF}>{PHONE}</a>
            </p>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
