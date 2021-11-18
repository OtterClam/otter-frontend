import { ethers } from 'ethers';
import { BondKey, getBond } from 'src/constants';
import { ClamMaiReserveContract, MaiReserveContract } from '../abi';

export const contractForReserve = (
  bondKey: BondKey,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
) => {
  const { type, reserve } = getBond(bondKey, networkID);
  if (type === 'lp') {
    return new ethers.Contract(reserve, ClamMaiReserveContract, provider);
  }
  return new ethers.Contract(reserve, MaiReserveContract, provider);
};
