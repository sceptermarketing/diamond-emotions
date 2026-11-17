import CollectionView, { collectionMetadata } from '@/components/collection/CollectionView';
import { CATALOG } from '@/lib/catalog';

const dept = CATALOG['wedding-bands'];

export const metadata = collectionMetadata(dept.main);

export default function Page() {
  return <CollectionView collection={dept.main} tiles={dept.tiles} showTiles />;
}
