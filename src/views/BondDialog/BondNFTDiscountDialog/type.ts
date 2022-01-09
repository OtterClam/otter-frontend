export interface NFTDiscountDetail {
  key: string; // nft image file name
  id: string; // nft unique id
  name: string;
  discount: number;
  type: 'note' | 'nft';
  expireAt: string;
}
