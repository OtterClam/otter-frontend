import { useMemo } from 'react';
import { useSelector } from '../../../store/hook';
import { useWeb3Context } from '../../../hooks';

import { Box } from '@material-ui/core';
import ClamMenu from '../ClamMenu';
import ConnectButton, { ConnectButtonStatus } from './ConnectButton';
import LanguagePicker from '../../LanguagePicker';

const ConnectMenu = () => {
  const { connected } = useWeb3Context();
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const connectStatus = useMemo(() => {
    if (pendingTransactions && pendingTransactions.length > 0) return ConnectButtonStatus.InProgress;
    if (connected) return ConnectButtonStatus.Connected;
    return ConnectButtonStatus.NotConnected;
  }, []);

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
