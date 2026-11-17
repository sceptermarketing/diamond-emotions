import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import PageIntro from '@/components/content/PageIntro';
import TrustBar from '@/components/home/TrustBar';
import WhyPartner from '@/components/home/WhyPartner';
import OurStory from '@/components/home/OurStory';
import Milestones from '@/components/home/Milestones';
import { LINKS } from '@/lib/links';

export const metadata: Metadata = {
  title: 'About Diamond Emotions | Wholesale Bridal & Fine Jewelry',
  description:
    'Family-founded in East Lansing, Michigan, in 2009, Diamond Emotions designs bridal and fine jewelry for independent jewelers only.',
  alternates: { canonical: LINKS.about },
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        title="About Diamond Emotions"
        text="Diamond Emotions designs engagement rings, wedding bands and fine jewelry for independent jewelers — and only for independent jewelers. Family-founded in East Lansing, Michigan, since 2009."
        image="/images/collections/cathedral-hero.jpg"
      >
        <Link href={LINKS.history} className="btn btn-sm btn-dark">
          Read Our History
        </Link>
        <Link href={LINKS.contact} className="btn btn-sm btn-outline">
          Contact Us
        </Link>
      </PageIntro>
      <TrustBar />
      <OurStory />
      <WhyPartner />
      <Milestones />
    </PageShell>
  );
}
