import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CollectionView, { collectionMetadata } from '@/components/collection/CollectionView';
import { CATALOG, getCollection } from '@/lib/catalog';

type Params = { params: Promise<{ collection: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CATALOG['fashion'].collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCollection('fashion', (await params).collection);
  return c ? collectionMetadata(c) : {};
}

export default async function Page({ params }: Params) {
  const c = getCollection('fashion', (await params).collection);
  if (!c) notFound();
  return <CollectionView collection={c} tiles={CATALOG['fashion'].tiles} />;
}
