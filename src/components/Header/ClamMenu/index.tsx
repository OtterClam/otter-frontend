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
import CustomButton from 'src/components/Button/CustomButton';
import { mobileMediaQuery } from 'src/themes/mediaQuery';
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
            decimals: tokenSymbol === 'PEARL' ? 18 : TOKEN_DECIMALS,
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

const BuyButton = ({ text }: { text: string }) => {
  const isMobile = useMediaQuery(mobileMediaQuery);
  if (isMobile) {
    return <CustomButton type="outline" text={text} />;
  }
  return <CustomButton type="outline" icon={ClamIcon} text={`${text} CLAM`} />;
};

function ClamMenu() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;

  const networkID = useSelector<IReduxState, number>(state => {
    return (state.app && state.app.networkID) || DEFAULT_NETWORK;
  });

  const addresses = getAddresses(networkID);

  const { CLAM_ADDRESS, sCLAM_ADDRESS, PEARL_ADDRESS } = addresses;

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = 'ohm-popper';
  // if (isSmallScreen) {
  //   return (
  //     <Link href={'https://quickswap.exchange/#/swap?outputCurrency=' + CLAM_ADDRESS} target="_blank" rel="noreferrer">
  //       <Box color="text.primary" className="ohm-button">
  //         <p>{t('components.buy')}</p>
  //       </Box>
  //     </Link>
  //   );
  // }
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <BuyButton text={t('common.buyThing')} />
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
                <Box component="div" className="buy-tokens">
                  <Link
                    href={
                      'https://quickswap.exchange/#/swap?outputCurrency=0x52A7F40BB6e9BD9183071cdBdd3A977D713F2e34 '
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="text" color="primary" fullWidth>
                      <Typography className="buy-text" align="left">
                        {t('components.buyPearl')} <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
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
                      onClick={addTokenToWallet('CLAM', CLAM_ADDRESS)}
                    >
                      <Typography className="buy-text">CLAM</Typography>
                    </Button>
                    <Button
                      variant="text"
                      size="large"
                      color="primary"
                      onClick={addTokenToWallet('sCLAM', sCLAM_ADDRESS)}
                    >
                      <Typography className="buy-text">sCLAM</Typography>
                    </Button>
                    <Button
                      variant="text"
                      size="large"
                      color="primary"
                      onClick={addTokenToWallet('PEARL', PEARL_ADDRESS)}
                    >
                      <Typography className="buy-text">PEARL</Typography>
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
