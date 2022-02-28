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
  WrongChain = 'wrongChain',
}

interface ConnectButtonProps {
  status: ConnectButtonStatus;
}
const ConnectButton = ({ status }: ConnectButtonProps) => {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const { t } = useTranslation();
  const { connect, disconnect, switchToPolygonMainnet } = useWeb3Context();
  const [popperOpen, setPopperOpen] = useState(false);
  const buttonRef = useRef(null);

  if (status === ConnectButtonStatus.Connected) {
    if (isMobile)
      return (
        <CustomButton type="outline" color="text.primary" text={t('components.disconnect')} onClick={disconnect} />
      );
    return (
      <CustomButton
        type="outline"
        color="text.primary"
        text={t('components.disconnect')}
        icon={MetamaskIcon}
        onClick={disconnect}
      />
    );
  }
  if (status === ConnectButtonStatus.WrongChain) {
    // TODO: to be translate - components.connect
    if (isMobile) return <CustomButton text="Switch Chain" onClick={switchToPolygonMainnet} />;
    return <CustomButton text={t('common.switchChain')} onClick={switchToPolygonMainnet} />;
  }
  if (status === ConnectButtonStatus.NotConnected) {
    // TODO: to be translate - components.connect
    if (isMobile)
      return <CustomButton bgcolor="otter.otterBlue" color="otter.white" text="Connect" onClick={connect} />;
    return (
      <CustomButton bgcolor="otter.otterBlue" color="otter.white" text={t('common.connectWallet')} onClick={connect} />
    );
  }

  if (status === ConnectButtonStatus.InProgress) {
    return (
      <>
        <CustomButton
          ref={buttonRef}
          bgcolor="otter.otterBlue"
          color="otter.white"
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
