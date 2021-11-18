import { getAddresses } from '.';

export type BondKey = 'mai' | 'mai_clam' | 'mai_clam_v2';

export const BondKeys: BondKey[] = ['mai', 'mai_clam', 'mai_clam_v2'];

export interface Bond {
  key: BondKey;
  name: string;
  address: string;
  reserve: string;
  type: 'token' | 'lp';
  lpUrl: string;
  deprecated: boolean;
}

type BondMap = {
  [key in BondKey]: Bond;
};

export function listBonds(chainId: number): BondMap {
  const { BONDS, RESERVES, MAI_ADDRESS, CLAM_ADDRESS } = getAddresses(chainId);
  return {
    mai: {
      key: 'mai',
      name: 'MAI',
      address: BONDS.MAI,
      reserve: RESERVES.MAI,
      type: 'token',
      lpUrl: '',
      deprecated: false,
    },
    mai_clam: {
      key: 'mai_clam',
      name: 'CLAM2-MAI LP',
      address: BONDS.MAI_CLAM,
      reserve: RESERVES.MAI_CLAM,
      type: 'lp',
      lpUrl: `https://quickswap.exchange/#/add/${MAI_ADDRESS}/${CLAM_ADDRESS}`,
      deprecated: false,
    },
    mai_clam_v2: {
      key: 'mai_clam_v2',
      name: 'CLAM-MAI LP V2',
      address: BONDS.MAI_CLAM_V2,
      reserve: RESERVES.OLD_MAI_CLAM,
      type: 'lp',
      lpUrl: `https://quickswap.exchange/#/add/${MAI_ADDRESS}/${CLAM_ADDRESS}`,
      deprecated: true,
    },
  };
}

export function getBond(bondKey: BondKey, chainId: number): Bond {
  return listBonds(chainId)[bondKey];
}
