import { ethers } from 'ethers';
import { BondKey, getBond } from '../constants';
import { OtterBond, OtterBondStake, OtterNonStableBondDepository, OtterPAWBondStakeDepository } from '../abi';

export const contractForBond = (
  bond: BondKey,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const { address, autostake, stable, supportNFT } = getBond(bond, networkID);
  if (supportNFT) {
    return new ethers.Contract(address, OtterPAWBondStakeDepository, provider);
  }
  if (stable) {
    return new ethers.Contract(address, autostake ? OtterBondStake : OtterBond, provider);
  }
  return new ethers.Contract(address, OtterNonStableBondDepository, provider);
};
