import { getAddresses, BONDS } from '../constants';

export const addressForAsset = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.mai) {
    return addresses.RESERVES.MAI;
  }

  if (bond === BONDS.mai_clam || bond === BONDS.mai_clam_v2) {
    return addresses.RESERVES.MAI_CLAM;
  }

  throw Error(`Address for asset doesn't support: ${bond}`);
};
