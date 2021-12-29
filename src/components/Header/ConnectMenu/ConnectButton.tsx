import { useRef, useState } from 'react';
import { useWeb3Context } from '../../../hooks';
import { useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import CustomButton from 'src/components/Button/CustomButton';
import PendingPopper from './PendingPopper';
import { ReactComponent as MetamaskIcon } from '../../../assets/icons/metamask.svg';

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
  const { t } = useTranslation();
  const { connect, disconnect } = useWeb3Context();
  if (status === ConnectButtonStatus.Connected) {
    if (isMobile) return <CustomButton type="outline" text={t('components.disconnect')} onClick={disconnect} />;
    return <CustomButton type="outline" text={t('components.disconnect')} icon={MetamaskIcon} onClick={disconnect} />;
  }
  if (status === ConnectButtonStatus.NotConnected) {
    // TODO: to be translate - components.connect
    if (isMobile) return <CustomButton text="Connect" onClick={connect} />;
    return <CustomButton text={t('common.connectWallet')} onClick={connect} />;
  }

  const [popperOpen, setPopperOpen] = useState(false);
  const buttonRef = useRef(null);
  if (status === ConnectButtonStatus.InProgress) {
    return (
      <>
        <CustomButton
          ref={buttonRef}
          text="In Progress" // TODO: to be translate - components.inProgress
          icon={MetamaskIcon}
          onMouseEnter={() => setPopperOpen(true)}
          onMouseLeave={() => setPopperOpen(false)}
          onClick={() => setPopperOpen(true)}
        />
        <PendingPopper open={popperOpen} anchorEl={buttonRef.current} />
      </>
    );
  }
  return null;
};

export default ConnectButton;
