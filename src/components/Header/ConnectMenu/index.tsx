import { useMemo } from 'react';
import { useAppSelector } from '../../../store/hook';
import { useWeb3Context } from '../../../hooks';

import { Box } from '@material-ui/core';
import ClamMenu from '../ClamMenu';
import ConnectButton, { ConnectButtonStatus } from './ConnectButton';
import LanguagePicker from '../../LanguagePicker';
import { CheckNetworkStatus } from 'src/hooks/web3/web3-context';

const ConnectMenu = () => {
  const { connected, checkNetworkStatus } = useWeb3Context();
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);

  const connectStatus = useMemo(() => {
    if (pendingTransactions && pendingTransactions.length > 0) return ConnectButtonStatus.InProgress;
    if (checkNetworkStatus === CheckNetworkStatus.OK && connected) return ConnectButtonStatus.Connected;
    if (checkNetworkStatus === CheckNetworkStatus.WRONG_CHAIN) return ConnectButtonStatus.WrongChain;
    return ConnectButtonStatus.NotConnected;
  }, [pendingTransactions, checkNetworkStatus, connected]);

  return (
    <div className="wallet-menu" id="wallet-menu">
      <Box sx={{ mx: 0.5 }}>
        <ClamMenu />
      </Box>
      <Box sx={{ mx: 0.5 }}>
        <ConnectButton status={connectStatus} />
      </Box>
      <Box sx={{ ml: 0.5 }}>
        <LanguagePicker border={true} />
      </Box>
    </div>
  );
};

export default ConnectMenu;
