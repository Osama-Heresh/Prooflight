import type { NftMetadata } from '@/lib/types';
import { NftCard } from './NftCard';

interface NftListProps {
  nfts: NftMetadata[];
}

export function NftList({ nfts }: NftListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <NftCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}
