import React, { useState, ReactElement, useContext, useMemo, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { DEFAULT_NETWORK, Networks, RPCURL } from '../../constants';
import * as UAuthWeb3Modal from '@uauth/web3modal';
import UAuthSPA, { UserInfo } from '@uauth/js';

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
  user: UserInfo;
  uauth: UAuthSPA;
  hasCachedProvider: () => boolean;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
  domain: String;
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

// These options are used to construct the UAuthSPA instance.
export const uauthOptions: UAuthWeb3Modal.IUAuthOptions = {
  clientID: 'z6XOGe/YsxypoBrOz2cKuYx/C/aCFPT55R93ZatXQ7A=',
  clientSecret: 'zbD7+u2fTjhLRv57VfWf54ZSlSAVqXWd9au0fM1npzI=',
  redirectUri: 'http://localhost:3000',

  // Must include both the openid and wallet scopes.
  scope: 'openid email wallet',
};

const providerOptions = {
  // Currently the package isn't inside the web3modal library currently. For now,
  // users must use this libary to create a custom web3modal provider.

  // All custom `web3modal` providers must be registered using the "custom-"
  // prefix.
  'custom-uauth': {
    // The UI Assets
    display: UAuthWeb3Modal.display,

    // The Connector
    connector: UAuthWeb3Modal.connector,

    // The SPA libary
    package: UAuthSPA,

    // The SPA libary options
    options: uauthOptions,
  },

  // For full functionality we include the walletconnect provider as well.
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'INFURA_ID',
    },
  },

  // Include any other web3modal providers here too...
};

const web3Modal_final = new Web3Modal({ providerOptions });
//const [user, setUser] = useState<any>();
// Register the web3modal so the connector has access to it.
UAuthWeb3Modal.registerWeb3Modal(web3Modal_final);

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const useUser = () => {
  const { user } = useWeb3Context();
  return user;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [chainID, setChainID] = useState(DEFAULT_NETWORK);
  const [address, setAddress] = useState('');

  const rpcUrl = (RPCURL as any)[chainID];
  const [uri, setUri] = useState(rpcUrl);
  const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri));
  const readOnlyProvider = useMemo(() => new StaticJsonRpcProvider((RPCURL as any)[chainID]), [chainID]);

  const [web3Modal] = useState<Web3Modal>(web3Modal_final);
  const [user, setUser] = useState<any>();
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

  const uauth = useMemo(() => {
    console.log('New UAuth instance!');
    const { package: uauthPackage, options: uauthOptions } = providerOptions!['custom-uauth'];
    return UAuthWeb3Modal.getUAuth(uauthPackage, uauthOptions);
  }, []);

  const connect = useCallback(async () => {
    const rawProvider = await web3Modal_final.connect();

    _initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, 'any');

    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();
    // setUser(await uauth.user());
    setUser(await uauth.user());

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
      user,
      uauth,
      readOnlyProvider,
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
      user,
      uauth,
      readOnlyProvider,
    ],
  );
  //@ts-ignore
  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
