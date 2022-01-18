import { BondNFTDiscount, NFTType, MyNFTInfo } from 'src/store/actions/nft-action';

export interface NFTDiscountOption extends BondNFTDiscount {
  type: MyNFTInfo['type'];
  id: MyNFTInfo['id'];
  address: MyNFTInfo['address'];
}
