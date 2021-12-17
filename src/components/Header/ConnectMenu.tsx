import { MouseEventHandler, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  SvgIcon,
  Typography,
  Popper,
  Paper,
  Divider,
  Link,
  Slide,
  useMediaQuery,
} from '@material-ui/core';
import { ReactComponent as ArrowUpIcon } from '../../assets/icons/arrow-up.svg';
import { ReactComponent as CaretDownIcon } from '../../assets/icons/caret-down.svg';
import { useWeb3Context } from '../../hooks';
import LanguagePicker from '../LanguagePicker';
import ClamMenu from './ClamMenu';
import { ReactComponent as MetamaskIcon } from '../../assets/icons/metamask.svg';
import { useTranslation } from 'react-i18next';

const useButtonText = ({
  isConnected,
  isSmallScreen,
  processing,
}: {
  isConnected: boolean;
  isSmallScreen: boolean;
  processing: boolean;
}) => {
  let buttonText = isSmallScreen ? 'Connect' : 'Connect Wallet';
  if (isConnected) {
    buttonText = 'Disconnect';
  }

  if (processing) {
    buttonText = 'In progress';
  }

  return buttonText;
};

function ConnectMenu() {
  const { t } = useTranslation();
  const { connect, disconnect, connected, chainID } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const pendingTransactions = useSelector(state => {
    //@ts-ignore
    return state.pendingTransactions;
  });

  const processing = pendingTransactions && pendingTransactions.length > 0;
  const buttonText = useButtonText({
    isConnected,
    processing,
    isSmallScreen,
  });

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const clickFunc: MouseEventHandler<HTMLDivElement> = event => {
    if (processing) {
      setAnchorEl(anchorEl ? undefined : event.currentTarget);
    } else if (isConnected) {
      disconnect();
    } else {
      connect({ switchNetwork: true });
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'ohm-popper-pending' : undefined;

  const primaryColor = '#49A1F2';

  const getEtherscanUrl = (txnHash: string) => {
    return chainID === 4 ? 'https://rinkeby.etherscan.io/tx/' + txnHash : 'https://polygonscan.com/tx/' + txnHash;
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(undefined);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [connected]);

  return (
    <div className="wallet-menu" id="wallet-menu">
      <Box className="connect-button">
        <ClamMenu />
      </Box>
      <Box
        className="connect-button"
        bgcolor="otter.otterBlue"
        color="otter.white"
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={clickFunc}
      >
        <SvgIcon
          component={MetamaskIcon}
          htmlColor="primary"
          style={{ marginRight: '10px', marginLeft: '-20px', width: '24px', height: '24px' }}
        />
        <p>{buttonText}</p>
        {pendingTransactions.length > 0 && (
          <Slide direction="left" in={isHovering} {...{ timeout: 333 }}>
            <SvgIcon className="caret-down" component={CaretDownIcon} htmlColor={primaryColor} />
          </Slide>
        )}
      </Box>

      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Paper className="ohm-menu" elevation={1}>
          {pendingTransactions.map((x: any) => (
            <Link key={x.txnHash} href={getEtherscanUrl(x.txnHash)} color="primary" target="_blank" rel="noreferrer">
              <div className="pending-txn-container">
                <Typography style={{ color: primaryColor }}>{x.text}</Typography>
                <SvgIcon component={ArrowUpIcon} htmlColor={primaryColor} />
              </div>
            </Link>
          ))}
          <Box className="add-tokens">
            <Divider color="secondary" />
            <Button variant="text" color="secondary" onClick={disconnect} style={{ marginBottom: '0px' }}>
              <Typography>{t('components.disconnect')}</Typography>
            </Button>
          </Box>
        </Paper>
      </Popper>

      <Box className="language-button">
        <LanguagePicker border={true} />
      </Box>
    </div>
  );
}

export default ConnectMenu;
