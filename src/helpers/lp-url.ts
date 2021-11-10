import { BONDS } from '../constants';
import { getAddresses } from '../constants';

export const lpURL = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.mai_clam || bond === BONDS.mai_clam_v2) {
    return `https://quickswap.exchange/#/add/${addresses.MAI_ADDRESS}/${addresses.CLAM_ADDRESS}`;
  }

  throw Error(`LP url doesn't support: ${bond}`);
};
