import { ethers } from 'ethers';
import { BondKey, getBond } from '../constants';
import { OtterBond, OtterBondStake, OtterNonStableBondDepository } from '../abi';

export const contractForBond = (
  bond: BondKey,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const { address, autostake, stable } = getBond(bond, networkID);
  if (stable) {
    return new ethers.Contract(address, autostake ? OtterBondStake : OtterBond, provider);
  } else {
    return new ethers.Contract(address, OtterNonStableBondDepository, provider);
  }
};
