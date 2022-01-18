import { NFTDiscountDetail } from './type';

import SAFE from 'src/components/NFTCards/images/nft1.jpg';
import FURRY from 'src/components/NFTCards/images/nft2.jpg';
import STONE from 'src/components/NFTCards/images/nft3.jpg';
import DIAMOND from 'src/components/NFTCards/images/nft4.jpg';
import SAFE_NOTE from 'src/assets/images/safe-hand-note.jpg';
import FURRY_NOTE from 'src/assets/images/furry-hand-note.jpg';
import STONE_NOTE from 'src/assets/images/stone-hand-note.jpg';
import DIAMOND_NOTE from 'src/assets/images/diamond-hand-note.jpg';

export const NFT_IMAGES: Record<string, any> = {
  SAFE,
  FURRY,
  STONE,
  DIAMOND,
  SAFE_NOTE,
  SAFE14: SAFE_NOTE,
  SAFE28: SAFE_NOTE,
  SAFE90: SAFE_NOTE,
  SAFE180: SAFE_NOTE,
  FURRY_NOTE,
  FURRY28: FURRY_NOTE,
  STONE_NOTE,
  STONE90: STONE_NOTE,
  DIAMOND_NOTE,
  DIAMOND180: DIAMOND_NOTE,
};

export type NFT =
  | 'SAFE'
  | 'SAFE14'
  | 'SAFE28'
  | 'SAFE90'
  | 'SAFE180'
  | 'FURRY'
  | 'FURRY28'
  | 'STONE'
  | 'STONE90'
  | 'DIAMOND'
  | 'DIAMOND180';

export const NFTTitleMap: Record<NFT, string> = {
  ['SAFE']: 'Safe-Hand Otter',
  ['SAFE14']: 'Safe-Hand 14-Day Note',
  ['SAFE28']: 'Safe-Hand 28-Day Note',
  ['SAFE90']: 'Safe-Hand 90-Day Note',
  ['SAFE180']: 'Safe-Hand 180-Day Note',
  ['FURRY']: 'Furry-Hand Otter',
  ['FURRY28']: 'Furry-Hand 28-Day Note',
  ['STONE']: 'Stone-Hand Otter',
  ['STONE90']: 'Stone-Hand 90-Day Note',
  ['DIAMOND']: 'Diamond-Hand Otter',
  ['DIAMOND180']: 'Diamond-Hand 180-Day Note',
};
