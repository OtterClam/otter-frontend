import React, { useState, ReactElement, useContext, useMemo, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { DEFAULT_NETWORK, Networks, RPCURL } from '../../constants';
import SnackbarUtils from '../../store/snackbarUtils';

type onChainProvider = {
  connect: () => Promise<Web3Provider | undefined>;
  disconnect: () => void;
  provider: JsonRpcProvider;
  readOnlyProvider: JsonRpcProvider;
  address: string;
  connected: Boolean;
  web3Modal: Web3Modal;
  chainID: number;
  web3?: any;
  checkNetworkStatus: CheckNetworkStatus;
  hasCachedProvider: () => boolean;
  switchToPolygonMainnet: () => Promise<boolean>;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

export enum CheckNetworkStatus {
  OK = 'OK',
  WRONG_CHAIN = 'WRONG_CHAIN',
  FAILURE = 'FAILURE',
}

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
  const [checkNetworkStatus, setCheckNetworkStatus] = useState<CheckNetworkStatus>(CheckNetworkStatus.OK);

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

  const switchToPolygonMainnet = useCallback(async (): Promise<boolean> => {
    try {
      await window.ethereum.request({
        // await web3Modal.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      });
    } catch (e: any) {
      //wallet currently does not have Polygon network,
      //ask to add it for them
      if (e.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            //https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://polygonscan.com/'],
                rpcUrls: ['https://polygon-rpc.com/'],
              },
            ],
          });
        } catch (addError) {
          if (e.code == 4001) {
            SnackbarUtils.error('error.userReject', true);
          } else {
            SnackbarUtils.error(e.message);
          }
          console.error(addError);
          return false;
        }
      }
      // User rejected the request.
      else if (e.code == 4001) {
        SnackbarUtils.error('error.userReject', true);
      }
      //failed to switch network, unknown error
      else {
        SnackbarUtils.error(e.message);
      }
      return false;
    }

    return true;
  }, []);

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
    [provider, checkNetworkStatus],
  );

  const _checkNetwork = (otherChainID: number): CheckNetworkStatus => {
    var status = CheckNetworkStatus.OK;

    if (chainID !== otherChainID) {
      console.warn('You are switching networks: ', otherChainID);
      const rpcUrl = (RPCURL as any)[otherChainID];
      if (rpcUrl) {
        setChainID(otherChainID);
        setUri(rpcUrl);
        status = CheckNetworkStatus.OK;
      } else {
        status = CheckNetworkStatus.FAILURE;
      }
    }

    if (!IsValidChain(otherChainID)) {
      status = CheckNetworkStatus.WRONG_CHAIN;
    }

    setCheckNetworkStatus(status);
    return status;
  };

  const connect = useCallback(async () => {
    const rawProvider = await web3Modal.connect();

    _initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, 'any');

    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();

    const validNetwork = _checkNetwork(chainId);
    if (validNetwork !== CheckNetworkStatus.OK) {
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
      checkNetworkStatus,
      switchToPolygonMainnet,
    }),
    [
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID,
      web3Modal,
      readOnlyProvider,
      checkNetworkStatus,
      switchToPolygonMainnet,
    ],
  );
  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
export const IsValidChain = (chainID: number): boolean => {
  return (
    Number(chainID) === Networks.POLYGON_MAINNET ||
    Number(chainID) === Networks.POLYGON_MUMBAI ||
    Number(chainID) === Networks.OTTER_FORK ||
    Number(chainID) === Networks.HARDHAT
  );
};
