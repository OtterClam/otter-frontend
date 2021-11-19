import { BigNumber, ethers } from 'ethers';
import { getAddresses } from '../constants';
import { ClamMaiReserveContract } from '../abi';

export async function getMarketPrice(
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): Promise<BigNumber> {
  const address = getAddresses(networkID);
  const pairContract = new ethers.Contract(address.RESERVES.MAI_CLAM, ClamMaiReserveContract, provider);
  const reserves = await pairContract.getReserves();
  const [clam, mai] = BigNumber.from(address.MAI_ADDRESS).gt(address.CLAM_ADDRESS)
    ? [reserves[0], reserves[1]]
    : [reserves[1], reserves[0]];
  const marketPrice = mai.div(clam);
  return marketPrice;
}
