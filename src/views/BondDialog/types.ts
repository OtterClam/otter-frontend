import { BondNFTDiscount, NFTType } from 'src/store/actions/nft-action';

export interface NFTDiscountOption extends BondNFTDiscount {
  type: NFTType;
}
