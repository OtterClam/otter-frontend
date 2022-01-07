// NOTE: this is mocked otter info for nft discount selection dialog
export enum OtterNft {
  FurryHandOtter = 'nft2',
  StoneHandOtter = 'nft3',
  DiamondHandOtter = 'nft4',
}

export interface NftDetail {
  name: string;
  image: string;
  discount: number;
}
