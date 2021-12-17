import React, { ReactElement, useContext, useMemo } from 'react';
import { OnChainProvider, useOnChainProvider } from './on-chain-provider';

export type Web3ContextData = {
  onChainProvider: OnChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      'useWeb3Context() can only be used inside of <Web3ContextProvider />, ' + 'please declare it at a higher level.',
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const onChainProvider = useOnChainProvider();
  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
