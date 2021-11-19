import { BondKey, getBond } from '../constants';

export const bondName = (key: BondKey, chainId: number): string => {
  return getBond(key, chainId).name;
};
