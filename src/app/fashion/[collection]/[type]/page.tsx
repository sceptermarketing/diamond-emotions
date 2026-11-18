import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CollectionView, { collectionMetadata } from '@/components/collection/CollectionView';
import { CATALOG, FASHION_TYPES, getFashionType } from '@/lib/catalog';

type Params = { params: Promise<{ collection: string; type: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FASHION_TYPES.map((t) => ({ collection: t.line, type: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { collection, type } = await params;
  const c = getFashionType(collection, type);
  return c ? collectionMetadata(c) : {};
}

export default async function Page({ params }: Params) {
  const { collection, type } = await params;
  const c = getFashionType(collection, type);
  if (!c) notFound();
  return <CollectionView collection={c} tiles={CATALOG.fashion.tiles} />;
}
