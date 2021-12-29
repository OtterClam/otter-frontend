import { useRef, useState } from 'react';
import { useWeb3Context } from '../../../hooks';

import CustomButton from 'src/components/Button/CustomButton';
import PendingPopper from './PendingPopper';
import { ReactComponent as MetamaskIcon } from '../../../assets/icons/metamask.svg';
import { useMediaQuery } from '@material-ui/core';

import { mobileMediaQuery } from 'src/themes/mediaQuery';

export enum ConnectButtonStatus {
  Connected = 'connected',
  InProgress = 'inProgress',
  NotConnected = 'notConnected',
}

interface ConnectButtonProps {
  status: ConnectButtonStatus;
}
const ConnectButton = ({ status }: ConnectButtonProps) => {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const { connect, disconnect } = useWeb3Context();
  if (status === ConnectButtonStatus.Connected) {
    if (isMobile) return <CustomButton text="Disconnect" onClick={disconnect} />;
    return <CustomButton text="Disconnect" icon={MetamaskIcon} onClick={disconnect} />;
  }
  if (status === ConnectButtonStatus.NotConnected) {
    if (isMobile) return <CustomButton text="Connect" onClick={connect} />;
    return <CustomButton text="Connect Wallet" onClick={connect} />;
  }

  const [popperOpen, setPopperOpen] = useState(false);
  const popperRef = useRef(null);
  if (status === ConnectButtonStatus.InProgress) {
    return (
      <>
        <CustomButton
          ref={popperRef}
          text="In Progress"
          icon={MetamaskIcon}
          onMouseEnter={() => setPopperOpen(true)}
          onMouseLeave={() => setPopperOpen(false)}
          onClick={() => setPopperOpen(true)}
        />
        <PendingPopper open={popperOpen} anchorEl={popperRef.current} />
      </>
    );
  }
  return null;
};

export default ConnectButton;
