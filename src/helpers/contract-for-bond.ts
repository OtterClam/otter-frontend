import { ethers } from 'ethers';
import { getAddresses, BONDS } from '../constants';
import { OtterBond } from '../abi';

export const contractForBond = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const addresses = getAddresses(networkID);
  const contractAddress = bond === BONDS.mai ? addresses.BONDS.MAI : addresses.BONDS.MAI_CLAM;
  return new ethers.Contract(contractAddress, OtterBond, provider);
};
