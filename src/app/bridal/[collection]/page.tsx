import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CollectionIntro from '@/components/collection/CollectionIntro';
import ProductGrid from '@/components/collection/ProductGrid';
import Faq from '@/components/home/Faq';
import FinalCta from '@/components/home/FinalCta';
import { COLLECTIONS, getCollection } from '@/lib/collections';

type Params = { params: Promise<{ collection: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCollection((await params).collection);
  if (!c) return {};
  return {
    title: `${c.title} | Diamond Emotions Wholesale`,
    description: c.intro,
  };
}

export default async function CollectionPage({ params }: Params) {
  const c = getCollection((await params).collection);
  if (!c) notFound();

  return (
    <>
      <Header variant="solid" />
      <main>
        <CollectionIntro collection={c} />
        <ProductGrid products={c.products} basePath={`${c.parent.href}${c.slug}/`} />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
