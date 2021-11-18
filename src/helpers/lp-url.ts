import { BondKey } from '../constants';
import { getBond } from '../constants';

export const lpURL = (name: BondKey, networkID: number): string => {
  return getBond(name, networkID).lpUrl;
};
