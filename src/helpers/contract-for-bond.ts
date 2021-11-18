import { ethers } from 'ethers';
import { BondKey, getBond } from '../constants';
import { OtterBond } from '../abi';

export const contractForBond = (
  bond: BondKey,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const { address } = getBond(bond, networkID);
  return new ethers.Contract(address, OtterBond, provider);
};
