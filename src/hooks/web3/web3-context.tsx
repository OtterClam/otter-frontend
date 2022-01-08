import React, { useState, ReactElement, useContext, useMemo, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { DEFAULT_NETWORK, Networks, RPCURL } from '../../constants';

type onChainProvider = {
  connect: () => Promise<Web3Provider>;
  disconnect: () => void;
  provider: JsonRpcProvider;
  readOnlyProvider: JsonRpcProvider;
  address: string;
  connected: Boolean;
  web3Modal: Web3Modal;
  chainID: number;
  web3?: any;
  hasCachedProvider: () => boolean;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
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
  const [connected, setConnected] = useState(false);
  const [chainID, setChainID] = useState(DEFAULT_NETWORK);
  const [address, setAddress] = useState('');

  const rpcUrl = (RPCURL as any)[chainID];
  const [uri, setUri] = useState(rpcUrl);
  const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri));
  const readOnlyProvider = useMemo(() => new StaticJsonRpcProvider((RPCURL as any)[chainID]), [chainID]);

  const [web3Modal] = useState<Web3Modal>(
    new Web3Modal({
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: RPCURL,
          },
        },
      },
      theme: 'light',
    }),
  );

  const hasCachedProvider = (): boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  const _initListeners = useCallback(
    (rawProvider: JsonRpcProvider) => {
      if (!rawProvider.on) {
        return;
      }

      rawProvider.on('accountsChanged', () => setTimeout(() => window.location.reload(), 1));

      rawProvider.on('chainChanged', (chain: number) => {
        _checkNetwork(chain);
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on('network', (_newNetwork, oldNetwork) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider],
  );

  const _checkNetwork = (otherChainID: number): Boolean => {
    if (
      Number(otherChainID) !== Networks.POLYGON_MAINNET &&
      Number(otherChainID) !== Networks.POLYGON_MUMBAI &&
      Number(otherChainID) !== Networks.OTTER_FORK &&
      Number(otherChainID) !== Networks.HARDHAT
    ) {
      alert('Please switch your wallet to Polygon network to use OtterClam!');
    }

    if (chainID !== otherChainID) {
      console.warn('You are switching networks: ', otherChainID);
      const rpcUrl = (RPCURL as any)[otherChainID];
      if (rpcUrl) {
        setChainID(otherChainID);
        setUri(rpcUrl);
        return true;
      }
      return false;
    }
    return true;
  };

  const connect = useCallback(async () => {
    const rawProvider = await web3Modal.connect();

    _initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, 'any');

    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();

    const validNetwork = _checkNetwork(chainId);
    if (!validNetwork) {
      console.error('Wrong network, please switch to Polygon Mainnet');
      return;
    }
    setAddress(connectedAddress);
    setProvider(connectedProvider);

    setConnected(true);

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
    console.log('disconnecting');
    web3Modal.clearCachedProvider();
    setConnected(false);

    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID,
      web3Modal,
      readOnlyProvider,
    }),
    [connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal, readOnlyProvider],
  );
  //@ts-ignore
  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
