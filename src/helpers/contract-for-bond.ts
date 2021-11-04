import { ethers } from 'ethers';
import { getAddresses, BONDS } from '../constants';
import { MimBondContract, MimTimeBondContract } from '../abi';

export const contractForBond = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.mai) {
    return new ethers.Contract(addresses.BONDS.MAI, MimBondContract, provider);
  }

  if (bond === BONDS.mai_clam) {
    return new ethers.Contract(addresses.BONDS.MAI_CLAM, MimTimeBondContract, provider);
  }

  throw Error(`Contract for bond doesn't support: ${bond}`);
};
