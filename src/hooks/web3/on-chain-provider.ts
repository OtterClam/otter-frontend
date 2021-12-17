import Web3Modal from 'web3modal';
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { DEFAULT_NETWORK, Networks, RPCURL } from 'src/constants';

export interface OnChainProvider {
  connect: (options?: { switchNetwork: boolean }) => Promise<Web3Provider | undefined>;
  disconnect: () => void;
  provider: JsonRpcProvider;
  readOnlyProvider: JsonRpcProvider;
  address: string;
  connected: boolean;
  web3Modal: Web3Modal;
  chainID: number;
  hasCachedProvider: () => boolean;
}

export const useOnChainProvider = (): OnChainProvider => {
  // these three variables are related to user inputs
  const [connectedNetwork, setConnectedNetwork] = useState<Networks>();
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  const [address, setAddress] = useState('');

  // all the variables below are derive from the above three variables
  const connected = network === connectedNetwork && Boolean(address);

  const provider = useProvider(network, connectedNetwork);

  const readOnlyProvider = useReadOnlyProvider(network);

  const web3Modal = useWeb3Modal();

  const hasCachedProvider = useHasCachedProviderCallback(web3Modal);

  const connect = useConnectCallback({
    web3Modal,
    provider,
    setAddress,
    setNetwork,
    setConnectedNetwork,
  });

  const disconnect = useDisconnectCallback({
    web3Modal,
    setConnectedNetwork,
  });

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID: network,
      web3Modal,
      readOnlyProvider,
    }),
    [connectedNetwork, network, address],
  );

  return onChainProvider;
};

const useProvider = (network: Networks, connectedNetwork?: Networks) => {
  const [provider, setProvider] = useState(() => createProvider(network));

  useEffect(() => {
    if (network === connectedNetwork) {
      setProvider(createProvider(network));
    }
  }, [network, connectedNetwork]);

  return provider;
};

const useReadOnlyProvider = (network: Networks) => {
  return useMemo(() => createProvider(network), [network]);
};

const createProvider = (network: Networks) => {
  return new StaticJsonRpcProvider(RPCURL.get(network));
};

const useWeb3Modal = () => {
  return useMemo(() => {
    const rpc = Array.from(RPCURL.entries()).reduce(
      (map, [key, val]) => Object.assign(map, { [key]: val }),
      {} as { [key: string]: string },
    );

    return new Web3Modal({
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
    });
  }, []);
};

const useConnectCallback = ({
  web3Modal,
  provider,
  setNetwork,
  setAddress,
  setConnectedNetwork,
}: {
  web3Modal: Web3Modal;
  provider: JsonRpcProvider;
  setNetwork: (network: Networks) => void;
  setConnectedNetwork: (network: Networks) => void;
  setAddress: (address: string) => void;
}) => {
  let rawProvider: any;
  let connectedProvider: Web3Provider;

  const changeNetwork = (chainId: number, address?: string) => {
    setConnectedNetwork(chainId);
    if (isValidChainId(chainId)) {
      setNetwork(chainId);
      if (address) {
        setAddress(address);
      }
    } else {
      setAddress('');
    }
  };

  const updateConnectionStatus = async () => {
    const chainId = parseChainId(await connectedProvider.getNetwork().then(network => network.chainId));
    const connectedAddress = await connectedProvider.getSigner().getAddress();
    changeNetwork(chainId, connectedAddress);
    return chainId;
  };

  const addListeners = () => {
    // NOTE: not sure why this will happen
    if (!rawProvider.on) {
      return;
    }

    rawProvider.on('accountsChanged', updateConnectionStatus);
    rawProvider.on('chainChanged', updateConnectionStatus);
  };

  return useCallback(
    async (options: { switchNetwork: boolean } = { switchNetwork: false }) => {
      if (!rawProvider) {
        rawProvider = await web3Modal.connect();
        connectedProvider = new Web3Provider(rawProvider, 'any');
        addListeners();
      }

      const network = await updateConnectionStatus();

      if (options.switchNetwork && !isValidChainId(network)) {
        switchNetwork();
      }

      return connectedProvider;
    },
    [provider, web3Modal],
  );
};

const useDisconnectCallback = ({
  web3Modal,
  setConnectedNetwork,
}: {
  web3Modal: Web3Modal;
  setConnectedNetwork: (network?: Networks) => void;
}) => {
  return useCallback(async () => {
    web3Modal.clearCachedProvider();
    setConnectedNetwork(undefined);
  }, [web3Modal]);
};

const useHasCachedProviderCallback = (web3Modal?: Web3Modal) => {
  return (): boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };
};

const isValidChainId = (chainId: number): boolean => {
  return RPCURL.has(chainId as any);
};

const parseChainId = (chainId: string | number): number => {
  return typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
};

const switchNetwork = () => {
  if (!window.ethereum) {
    console.error('failed to switch network');
    return;
  }

  window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x' + DEFAULT_NETWORK.toString(16) }],
  });
};
