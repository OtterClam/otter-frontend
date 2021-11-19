import { getAddresses } from '.';

// export type BondKey = 'mai' | 'mai_clam' | 'mai-v1' | 'mai_clam_v2-v1' | 'mai_clam-v1';
export type BondKey = 'mai-v1' | 'mai_clam_v2-v1' | 'mai_clam-v1';

// export const BondKeys: BondKey[] = ['mai', 'mai_clam', 'mai-v1', 'mai_clam-v1', 'mai_clam_v2-v1'];
export const BondKeys: BondKey[] = ['mai-v1', 'mai_clam-v1', 'mai_clam_v2-v1'];

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
    // mai: {
    //   key: 'mai',
    //   name: 'MAI',
    //   address: BONDS.MAI,
    //   reserve: RESERVES.MAI,
    //   type: 'token',
    //   lpUrl: '',
    //   deprecated: false,
    // },
    // mai_clam: {
    //   key: 'mai_clam',
    //   name: 'CLAM2-MAI LP',
    //   address: BONDS.MAI_CLAM,
    //   reserve: RESERVES.MAI_CLAM,
    //   type: 'lp',
    //   lpUrl: `https://quickswap.exchange/#/add/${MAI_ADDRESS}/${CLAM_ADDRESS}`,
    //   deprecated: false,
    // },
    'mai-v1': {
      key: 'mai-v1',
      name: 'MAI(v1)',
      address: BONDS.OLD_MAI,
      reserve: RESERVES.MAI,
      type: 'token',
      lpUrl: '',
      deprecated: true,
    },
    'mai_clam-v1': {
      key: 'mai_clam-v1',
      name: 'CLAM-MAI LP(v1)',
      address: BONDS.OLD_MAI_CLAM,
      reserve: RESERVES.OLD_MAI_CLAM,
      type: 'lp',
      lpUrl: `https://quickswap.exchange/#/add/${MAI_ADDRESS}/${CLAM_ADDRESS}`,
      deprecated: true,
    },
    'mai_clam_v2-v1': {
      key: 'mai_clam_v2-v1',
      name: 'CLAM-MAI LP V2(v1)',
      address: BONDS.OLD_MAI_CLAM_V2,
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
