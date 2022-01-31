import { UserInfo } from '@uauth/js';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const useENS = (address: string, user: UserInfo) => {
  const [ensName, setENSName] = useState<string | null>(null);
  useEffect(() => {
    if (user?.sub != null) {
      setENSName(user.sub);
    } else {
      const resolveENS = async () => {
        if (ethers.utils.isAddress(address)) {
          const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');
          const ensName = await provider.lookupAddress(address);
          setENSName(ensName);
        }
      };
      resolveENS();
    }
  }, [address]);
  return { ensName };
};

export default useENS;
