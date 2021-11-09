import { ethers } from 'ethers';
import { getAddresses, BONDS } from 'src/constants';
import { MaiReserveContract, ClamMaiReserveContract } from '../abi';

export const contractForReserve = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
) => {
  const addresses = getAddresses(networkID);
  if (bond === BONDS.mai) {
    return new ethers.Contract(addresses.RESERVES.MAI, MaiReserveContract, provider);
  }

  if (bond === BONDS.mai_clam || bond === BONDS.mai_clam_v2) {
    return new ethers.Contract(addresses.RESERVES.MAI_CLAM, ClamMaiReserveContract, provider);
  }

  throw Error(`Contract for reserve doesn't support: ${bond}`);
};
