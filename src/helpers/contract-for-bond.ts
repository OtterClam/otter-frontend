import { ethers } from 'ethers';
import { getAddresses, BONDS } from '../constants';
import { OtterBond } from '../abi';

export const contractForBond = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const addresses = getAddresses(networkID);
  const mapping = {
    [BONDS.mai]: addresses.BONDS.MAI,
    [BONDS.mai_clam]: addresses.BONDS.MAI_CLAM,
    [BONDS.mai_clam_v2]: addresses.BONDS.MAI_CLAM_V2,
  };
  const contractAddress = mapping[bond];
  return new ethers.Contract(contractAddress, OtterBond, provider);
};
