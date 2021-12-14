import { useState } from 'react';
import { getAddresses, TOKEN_DECIMALS, DEFAULT_NETWORK } from '../../../constants';
import { useSelector } from 'react-redux';
import {
  Link,
  SvgIcon,
  Popper,
  Button,
  Paper,
  Typography,
  Divider,
  Box,
  Fade,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import { ReactComponent as ArrowUpIcon } from '../../../assets/icons/arrow-up.svg';
import { ReactComponent as ClamIcon } from '../../../assets/icons/CLAM.svg';
import './clam-menu.scss';
import { IReduxState } from '../../../store/slices/state.interface';
import { getTokenUrl, Token } from '../../../helpers';
import { useTranslation } from 'react-i18next';

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
  const tokenImage = getTokenUrl(tokenSymbol.toLowerCase() as Token);

  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: tokenImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const useStyles = makeStyles(theme => ({
  popperMenu: {
    '& .MuiButton-containedSecondary': {
      backgroundColor: theme.palette.mode.lightGray200,
    },
  },
}));

function ClamMenu() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const networkID = useSelector<IReduxState, number>(state => {
    return (state.app && state.app.networkID) || DEFAULT_NETWORK;
  });

  const addresses = getAddresses(networkID);

  const { CLAM_ADDRESS, sCLAM_ADDRESS } = addresses;

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = 'ohm-popper';
  if (isSmallScreen) {
    return (
      <Link href={'https://quickswap.exchange/#/swap?outputCurrency=' + CLAM_ADDRESS} target="_blank" rel="noreferrer">
        <Box color="text.primary" className="ohm-button">
          <p>{t('components.buy')}</p>
        </Box>
      </Link>
    );
  }
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Box color="text.primary" className="ohm-button">
        <SvgIcon
          component={ClamIcon}
          htmlColor="primary"
          style={{ marginRight: '10px', marginLeft: '-20px', width: '24px', height: '24px' }}
        />
        <p>{t('common.buyThing')}CLAM2</p>
      </Box>

      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={400}>
              <Paper className={`${styles.popperMenu} ohm-menu`} elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={'https://quickswap.exchange/#/swap?outputCurrency=' + CLAM_ADDRESS}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="text" color="primary" fullWidth>
                      <Typography className="buy-text" align="left">
                        {t('components.buyOnQuickswap')} <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>{t('components.addTokenToWallet')}</p>
                    <Button
                      size="large"
                      variant="text"
                      color="primary"
                      onClick={addTokenToWallet('CLAM2', CLAM_ADDRESS)}
                    >
                      <Typography className="buy-text">CLAM2</Typography>
                    </Button>
                    <Button
                      variant="text"
                      size="large"
                      color="primary"
                      onClick={addTokenToWallet('sCLAM2', sCLAM_ADDRESS)}
                    >
                      <Typography className="buy-text">sCLAM2</Typography>
                    </Button>
                  </Box>
                ) : null}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default ClamMenu;
