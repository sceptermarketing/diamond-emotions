import CollectionView, { collectionMetadata } from '@/components/collection/CollectionView';
import { NEW_ARRIVALS } from '@/lib/catalog';

export const metadata = collectionMetadata(NEW_ARRIVALS);

export default function Page() {
  return <CollectionView collection={NEW_ARRIVALS} />;
}
