import { getAddresses } from '.';

export type BondKey = 'frax' | 'mai' | 'mai_clam' | 'mai-v1' | 'mai_clam_v2-v1' | 'mai_clam-v1';

export const BondKeys: BondKey[] = ['frax', 'mai', 'mai_clam', 'mai-v1', 'mai_clam-v1', 'mai_clam_v2-v1'];

export const ReserveKeys: BondKey[] = ['mai', 'frax'];

export interface Bond {
  key: BondKey;
  name: string;
  address: string;
  reserve: string;
  reserveUnit: string;
  type: 'token' | 'lp';
  lpUrl: string;
  deprecated: boolean;
  autostake: boolean;
}

type BondMap = {
  [key in BondKey]: Bond;
};

export function listBonds(chainId: number): BondMap {
  const { BONDS, RESERVES, MAI_ADDRESS, CLAM_ADDRESS } = getAddresses(chainId);
  return {
    frax: {
      key: 'frax',
      name: 'FRAX (4,4)',
      address: '0x5Fa0FBDb07Fe9647B43426dcc79da984f0327E4a',
      reserve: '0x45c32fa6df82ead1e2ef74d17b76547eddfaff89',
      reserveUnit: 'FRAX',
      type: 'token',
      lpUrl: '',
      deprecated: false,
      autostake: true,
    },
    mai: {
      key: 'mai',
      name: 'MAI',
      address: BONDS.MAI,
      reserve: RESERVES.MAI,
      reserveUnit: 'MAI',
      type: 'token',
      lpUrl: '',
      deprecated: false,
      autostake: false,
    },
    mai_clam: {
      key: 'mai_clam',
      name: 'MAI-CLAM2 LP',
      address: BONDS.MAI_CLAM,
      reserve: RESERVES.MAI_CLAM,
      reserveUnit: 'LP',
      type: 'lp',
      lpUrl: `https://quickswap.exchange/#/add/${MAI_ADDRESS}/${CLAM_ADDRESS}`,
      deprecated: false,
      autostake: false,
    },
    'mai-v1': {
      key: 'mai-v1',
      name: 'MAI v1',
      address: BONDS.OLD_MAI,
      reserve: RESERVES.MAI,
      reserveUnit: 'MAI',
      type: 'token',
      lpUrl: '',
      deprecated: true,
      autostake: false,
    },
    'mai_clam-v1': {
      key: 'mai_clam-v1',
      name: 'MAI-CLAM v1-legacy',
      address: BONDS.OLD_MAI_CLAM,
      reserve: RESERVES.OLD_MAI_CLAM,
      reserveUnit: 'LP',
      type: 'lp',
      lpUrl: `https://quickswap.exchange/#/add/${MAI_ADDRESS}/${CLAM_ADDRESS}`,
      deprecated: true,
      autostake: false,
    },
    'mai_clam_v2-v1': {
      key: 'mai_clam_v2-v1',
      name: 'MAI-CLAM v1',
      address: BONDS.OLD_MAI_CLAM_V2,
      reserve: RESERVES.OLD_MAI_CLAM,
      reserveUnit: 'LP',
      type: 'lp',
      lpUrl: `https://quickswap.exchange/#/add/${MAI_ADDRESS}/${CLAM_ADDRESS}`,
      deprecated: true,
      autostake: false,
    },
  };
}

export function getBond(bondKey: BondKey, chainId: number): Bond {
  return listBonds(chainId)[bondKey];
}
