import { OtterNft, NftDetail } from './type';

import NFT2 from '../../../components/NFTCards/images/nft2.jpg';
import NFT3 from '../../../components/NFTCards/images/nft3.jpg';
import NFT4 from '../../../components/NFTCards/images/nft4.jpg';

export const DEFAULT_OPTIONS = [OtterNft.FurryHandOtter, OtterNft.StoneHandOtter, OtterNft.DiamondHandOtter];
export const DISCOUNT_NFTS: Record<OtterNft, NftDetail> = {
  [OtterNft.FurryHandOtter]: {
    name: 'Furry-Hand Otter',
    image: NFT2,
    discount: 5,
  },
  [OtterNft.StoneHandOtter]: {
    name: 'Stone-Hand Otter',
    image: NFT3,
    discount: 10,
  },
  [OtterNft.DiamondHandOtter]: {
    name: 'Diamond-Hand Otter',
    image: NFT4,
    discount: 15,
  },
};
