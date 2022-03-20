import { BondKey } from 'src/constants';
import { getTokenImage } from '.';

export const priceUnits = (bond: BondKey) => {
  if (bond === 'mai44') {
    return getTokenImage('mai', 20);
  }
  return '$';
};
