import { BondKey } from 'src/constants';
import { getTokenImage } from '.';

export const priceUnits = (bond: BondKey) => {
  if (bond === 'mai44') {
    return getTokenImage('mai', 20);
  }
  if (bond === 'frax2') {
    return getTokenImage('frax', 20);
  }

  return '$';
};
