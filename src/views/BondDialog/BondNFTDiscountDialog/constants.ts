import { NFTDiscountDetail } from './type';

import NFT1 from 'src/components/NFTCards/images/nft1.jpg';
import NFT2 from 'src/components/NFTCards/images/nft2.jpg';
import NFT3 from 'src/components/NFTCards/images/nft3.jpg';
import NFT4 from 'src/components/NFTCards/images/nft4.jpg';

// TODO: add nft note images
export const NFT_IMAGES: Record<string, any> = {
  nft1: NFT1,
  nft2: NFT2,
  nft3: NFT3,
  nft4: NFT4,
};

// NOTE: this is mocked options
export const MOCKED_NFT_OPTIONS: NFTDiscountDetail[] = [
  {
    id: '1',
    key: 'nft1',
    name: 'Saft-Hand Otter',
    discount: 5,
    type: 'nft',
    expireAt: '2022/1/18',
  },
  {
    id: '2',
    key: 'nft2',
    name: 'Furry-Hand Otter',
    discount: 5,
    type: 'nft',
    expireAt: '2022/1/18',
  },
  {
    id: '3',
    key: 'nft3',
    name: 'Stone-Hand Otter',
    discount: 10,
    type: 'nft',
    expireAt: '2022/1/18',
  },
  {
    id: '4',
    key: 'nft4',
    name: 'Diamond-Hand Otter',
    discount: 15,
    type: 'nft',
    expireAt: '2022/1/18',
  },
];
