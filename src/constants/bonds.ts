import { getAddresses } from '.';

export type BondKey = 'frax2' | 'frax_clam' | 'mai44' | 'matic' | 'matic_clam' | 'mai_clam44';
export const ReserveKeys: BondKey[] = ['mai44', 'frax2'];
export const BondKeys: BondKey[] = ['frax2', 'frax_clam', 'matic', 'matic_clam', 'mai44', 'mai_clam44'];

export enum BondAction {
  Bond = 'bond',
  Redeem = 'redeem',
}

export type BondType = 'token' | 'lp';

export interface Bond {
  key: BondKey;
  name: string;
  address: string;
  reserve: string;
  reserveUnit: string;
  type: BondType;
  dexUrl: string;
  deprecated: boolean;
  autostake: boolean;
  stable: boolean;
  supportNFT: boolean;
  oracle?: string;
}

type BondMap = {
  [key in BondKey]: Bond;
};

export interface AccountBond {
  bond: BondKey;
  allowance: number;
  balance: number;
  rawBalance: string;
  interestDue: number;
  bondMaturationTime: number;
  pendingPayout: number;
}

export interface Bonding {
  loading: boolean;
  bond: BondKey;
  bondDiscount: number;
  debtRatio: number;
  bondQuote: number;
  purchased: number;
  vestingTerm: number;
  maxPayout: number;
  bondPrice: number;
  marketPrice: string;
  maxUserCanBuy: string;
  nftApproved: boolean;
}

export function listBonds(chainId: number): BondMap {
  const { RESERVES, BONDS, MAI_ADDRESS, CLAM_ADDRESS } = getAddresses(chainId);
  return {
    matic: {
      key: 'matic',
      name: 'WMATIC (4,4)',
      address: '0xf57Fb38f57D2a4Fca0ee074A3F3b4e5C570959E4',
      reserve: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      reserveUnit: 'WMATIC',
      type: 'token',
      dexUrl: `https://quickswap.exchange/#/swap?outputCurrency=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270`,
      deprecated: true,
      autostake: true,
      stable: false,
      oracle: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
      supportNFT: false,
    },
    matic_clam: {
      key: 'matic_clam',
      name: 'WMATIC-CLAM (4,4)',
      address: '0x1dAc605bDD4e8F3ab23da9B360e672f4e973A196',
      reserve: '0x3fCc446c70489610462BE9d61528C51151aCA49f',
      reserveUnit: '',
      type: 'lp',
      dexUrl: `https://quickswap.exchange/#/add/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270/${CLAM_ADDRESS}`,
      deprecated: true,
      autostake: true,
      stable: false,
      oracle: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
      supportNFT: false,
    },
    frax2: {
      key: 'frax2',
      name: 'FRAX (4,4)',
      address: '0x9e1430EB3b56e8953a342BFBBdD2DDC3b6E84d9D',
      reserve: '0x45c32fa6df82ead1e2ef74d17b76547eddfaff89',
      reserveUnit: 'FRAX',
      type: 'token',
      dexUrl: 'https://app.sushi.com/swap?outputCurrency=0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89',
      deprecated: true,
      autostake: true,
      stable: true,
      supportNFT: false,
    },
    frax_clam: {
      key: 'frax_clam',
      name: 'FRAX-CLAM (4,4)',
      address: '0xd99c8aF24c5E7fd6E292b1682Ec0f0cB3535e002',
      reserve: '0x1f847e05afaf47ec54626928d0e6c235663e938f',
      reserveUnit: 'LP',
      type: 'lp',
      dexUrl:
        'https://app.sushi.com/add/0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89/0xC250e9987A032ACAC293d838726C511E6E1C029d',
      deprecated: true,
      autostake: true,
      stable: true,
      supportNFT: false,
    },
    mai44: {
      key: 'mai44',
      name: 'MAI (4,4)',
      address: '0x779CB532e289CbaA3d0692Ae989C63C2B4fBd4d0',
      reserve: RESERVES.MAI,
      reserveUnit: 'MAI',
      type: 'token',
      dexUrl: `https://quickswap.exchange/#/swap?outputCurrency=${MAI_ADDRESS}`,
      deprecated: true,
      autostake: true,
      stable: true,
      supportNFT: false,
    },
    mai_clam44: {
      key: 'mai_clam44',
      name: 'MAI-CLAM (4,4)',
      address: BONDS.MAI_CLAM,
      reserve: RESERVES.MAI_CLAM,
      reserveUnit: 'LP',
      type: 'lp',
      dexUrl: `https://quickswap.exchange/#/add/${MAI_ADDRESS}/${CLAM_ADDRESS}`,
      deprecated: true,
      autostake: true,
      stable: true,
      supportNFT: false,
    },
  };
}

export function getBond(bondKey: BondKey, chainId: number): Bond {
  return listBonds(chainId)[bondKey];
}
