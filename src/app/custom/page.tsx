import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import CustomProgram from '@/components/home/CustomProgram';
import Gallery from '@/components/content/Gallery';
import { GALLERY, GALLERY_CATEGORIES } from '@/lib/content';
import { LINKS } from '@/lib/links';
import l from '@/components/content/Layout.module.css';

export const metadata: Metadata = {
  title: 'Custom Jewelry | Diamond Emotions',
  description:
    'Unique, one-of-a-kind custom jewelry for your customers: send a sketch or a style to start from, approve the CAD, receive the finished piece.',
  alternates: { canonical: LINKS.custom },
};

export default function CustomPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Custom' }]}
        title="Custom Jewelry"
        text="At Diamond Emotions, we craft unique, one-of-a-kind custom jewelry pieces for customers of our retailers. We can make custom pieces based on any of the designs below, or on a design that you send."
      >
        <Link href={LINKS.customOrder} className="btn btn-sm btn-dark">
          Start a Custom Order
        </Link>
        <Link href={LINKS.customProcess} className="btn btn-sm btn-outline">
          See How it Works
        </Link>
      </PageIntro>
      <CustomProgram />
      <section className={l.section}>
        <div className={l.head}>
          <h2 className={l.heading}>Custom Pieces We’ve Made</h2>
          <p className={l.lead}>A sample of the many custom pieces we have crafted. Quote the style number on your custom order to start from one.</p>
        </div>
        <Gallery items={GALLERY} categories={GALLERY_CATEGORIES} />
      </section>
    </PageShell>
  );
}
