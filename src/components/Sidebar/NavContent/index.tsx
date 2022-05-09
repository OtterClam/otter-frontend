import { Box, Grid, Link, makeStyles, Paper, Tooltip, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import groupBy from 'lodash/groupBy';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import AuditedMark from 'src/components/AuditedMark';
import SocialIcons from 'src/components/SocialIcons';
import { DEFAULT_NETWORK, getAddresses } from 'src/constants';
import { AppThemeContext } from 'src/helpers/app-theme-context';
import useENS from 'src/hooks/useENS';
import { IReduxState } from 'src/store/slices/state.interface';
import { shorten, trim } from '../../../helpers';
import { useAddress, useBonds } from '../../../hooks';
import '../sidebar.scss';
import ActiveMenuIcon from './ActiveMenuIcon';
import AppLogo from './AppLogo';
import AppTitle from './AppTitle';
import InactiveMenuIcon from './InactiveMenuIcon';
import ToggleDark from './toggle-dark.png';
import ToggleLight from './toggle-light.png';
import Davatar from '@davatar/react';
import { useAppSelector } from 'src/store/hook';

import IconDefaultBond from './icons/components/bond/IconDefaultBond';
import IconActiveBond from './icons/components/bond/IconActiveBond';

import IconDefaultCalculator from './icons/components/calculator/IconDefaultCalculator';
import IconActiveCalculator from './icons/components/calculator/IconActiveCalculator';

import IconDefaultPearlChest from './icons/components/pearl-chest/IconDefaultPearlChest';
import IconActivePearlChest from './icons/components/pearl-chest/IconActivePearlChest';

import IconDefaultWrap from './icons/components/wrap/IconDefaultWrap';
import IconActiveWrap from './icons/components/wrap/IconActiveWrap';

import IconDefaultStake from './icons/components/stake/IconDefaultStake';
import IconActiveStake from './icons/components/stake/IconActiveStake';

import IconDefaultDashboard from './icons/components/dashboard/IconDefaultDashboard';
import IconActiveDashboard from './icons/components/dashboard/IconActiveDashboard';

import IconDefaultNFT from './icons/components/NFT/IconDefaultNFT';
import IconDefaultBuyClam from './icons/components/buy-clam/IconDefaultBuyClam';

const useStyles = makeStyles(theme => ({
  navbar: {
    '& .active': {
      color: theme.palette.text.secondary,
    },
  },
}));

const useGroupedBonds = () => {
  const bonds = useBonds();
  return groupBy(bonds, bond => (bond.deprecated ? 'deprecated' : 'active'));
};

type Page = 'dashboard' | 'wrap' | 'stake' | 'choose_bond' | 'bonds' | 'migrate' | 'calculator' | 'pearl-chests';

type ComputedBond = ReturnType<typeof useBonds>[0];

function BondROI({ bond }: { bond: ComputedBond }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const fiveDayRate = useSelector<IReduxState, number>(state => state.app.fiveDayRate);
  const bondPrice = useSelector<IReduxState, number>(state => {
    return state.bonding[bond.value] && state.bonding[bond.value].bondPrice;
  });
  const marketPrice = useAppSelector(state => state.bonding[bond.value]?.marketPrice);
  const priceDiff = (Number(marketPrice) ?? 0) - (bondPrice ?? 0);
  const dotColor = theme.palette.mode.chip.status.success;
  const dot = <span className="bond-pair-roi-dot" style={{ background: dotColor }} />;
  const roiString = t('bonds.purchase.roiFourFourInfo');
  return (
    <span className="bond-pair-roi">
      <span className="bond-pair-roi-value">
        {priceDiff > 0 && dot}
        {bond.autostake ? (
          <Tooltip title={roiString}>
            <span>{bond.discount && trim((bond.discount + fiveDayRate) * 100, 2)}%*</span>
          </Tooltip>
        ) : (
          <span>{bond.discount && trim(bond.discount * 100, 2)}%</span>
        )}
      </span>
      {/* {priceDiff > 0 && (
        <StatusChip
          className="bond-pair-roi-discount"
          dot={false}
          status={Status.Success}
          label={`$${trim(priceDiff, 2)} discount!`}
        />
      )} */}
    </span>
  );
}

function NavContent() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { active: activeBonds = [] } = useGroupedBonds();
  const address = useAddress();
  const { ensName } = useENS(address);
  const location = useLocation();
  const currentTheme = useContext(AppThemeContext);
  const currentThemeName = currentTheme.name;
  const currentMainColor = currentTheme.theme.palette.primary.main;
  const networkID = useSelector<IReduxState, number>(state => {
    return (state.app && state.app.networkID) || DEFAULT_NETWORK;
  });
  const addresses = getAddresses(networkID);
  const { CLAM_ADDRESS } = addresses;

  const checkPage = useCallback((location: any, page: Page): boolean => {
    const currentPath = location.pathname.replace('/', '');
    if ((currentPath.indexOf('bonds') >= 0 || currentPath.indexOf('choose_bond') >= 0) && page === 'bonds') {
      return true;
    }
    if (currentPath.indexOf(page) >= 0) {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Link href="https://www.otterclam.finance" target="_blank">
            <Box display="flex" flexDirection="column" className="branding-header">
              <AppLogo />
              <Box mt="10px" />
              <AppTitle />
              {address && (
                <div className="dapp-account">
                  <Davatar size={20} address={address} generatedAvatarType="jazzicon" />
                  <div>{ensName || shorten(address)}</div>
                </div>
              )}
            </Box>
          </Link>

          <div className="dapp-menu-links">
            <div className={`${styles.navbar} dapp-nav`} id="navbarNav">
              <Link
                component={NavLink}
                id="dashboard-nav"
                to="/dashboard"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'dashboard');
                }}
                activeClassName="active"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  {checkPage(location, 'dashboard') ? (
                    <IconActiveDashboard />
                  ) : (
                    <IconDefaultDashboard color={currentMainColor} />
                  )}
                  <p>{t('common.dashboard')}</p>
                </div>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/stake"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'stake');
                }}
                activeClassName="active"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  {checkPage(location, 'stake') ? <IconActiveStake /> : <IconDefaultStake color={currentMainColor} />}
                  <p>{t('common.stake')}</p>
                </div>
              </Link>
              <Link
                component={NavLink}
                id="pearl-chests-nav"
                to="/pearl-chests"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'pearl-chests');
                }}
                activeClassName="active"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  {checkPage(location, 'pearl-chests') ? (
                    <IconActivePearlChest />
                  ) : (
                    <IconDefaultPearlChest color={currentMainColor} />
                  )}
                  <p>{t('common.pearlChests')}</p>
                </div>
              </Link>
              <Link
                component={NavLink}
                id="wrap-nav"
                to="/wrap"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'wrap');
                }}
                activeClassName="active"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  {checkPage(location, 'wrap') ? <IconActiveWrap /> : <IconDefaultWrap color={currentMainColor} />}
                  <p>{t('common.wrap')}</p>
                </div>
              </Link>

              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'bonds');
                }}
                activeClassName="active"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  {checkPage(location, 'bonds') ? <IconActiveBond /> : <IconDefaultBond color={currentMainColor} />}
                  <p>{t('common.bond')}</p>
                </div>
              </Link>

              <div>
                {activeBonds.some(bond => bond.discount > 0 && !bond.deprecated) ? (
                  <div className="dapp-menu-data discounts">
                    <div className="bond-discounts">
                      <div className="bond-discounts-group">
                        <div className="bond-discounts-group-title bond">
                          <span>{t('components.name')}</span>
                          <span className="bond-pair-roi">{t('common.roi')}</span>
                        </div>
                        {activeBonds.map((bond, i) => (
                          <Link component={NavLink} to={`/bonds/${bond.value}`} key={i} className={'bond'}>
                            {bond.discount == NaN ? (
                              <Skeleton variant="text" width={'150px'} />
                            ) : (
                              <p>
                                {bond.name}
                                <BondROI bond={bond} />
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <Link href="https://ottopia.app" target="_blank" rel="noreferrer" className="button-dapp-menu">
                <div className="dapp-menu-item">
                  <IconDefaultNFT color={currentMainColor} />
                  <p>Otto</p>
                  <div className="dapp-menu-item__new">NEW</div>
                </div>
              </Link>

              <Link
                href={'https://quickswap.exchange/#/swap?outputCurrency=' + CLAM_ADDRESS}
                target="_blank"
                rel="noreferrer"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  <IconDefaultBuyClam />
                  <p>{t('common.buyThing')}CLAM</p>
                </div>
              </Link>
              <Link
                component={NavLink}
                id="calculator-nav"
                to="/calculator"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'calculator');
                }}
                activeClassName="active"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  {checkPage(location, 'calculator') ? (
                    <IconActiveCalculator />
                  ) : (
                    <IconDefaultCalculator color={currentMainColor} />
                  )}
                  <p>{t('common.calculator')}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="flex-end" flexDirection="column">
          <Grid container justifyContent="center" alignItems="center" spacing={0}>
            {currentThemeName === 'dark' && (
              <Grid item>
                <Box
                  className="light-dark-toggle"
                  component="button"
                  bgcolor="otter.otterBlue"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="100%"
                  border="0px"
                  width="32px"
                  height="32px"
                  onClick={() => window.dispatchEvent(new CustomEvent('change-theme', { detail: { theme: 'light' } }))}
                >
                  <img src={ToggleDark} width="76px" height="40px" />
                </Box>
              </Grid>
            )}
            {currentThemeName === 'light' && (
              <Grid item>
                <Box
                  className="light-dark-toggle"
                  component="button"
                  bgcolor="otter.white"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="100%"
                  border="0px"
                  width="32px"
                  height="32px"
                  onClick={() => window.dispatchEvent(new CustomEvent('change-theme', { detail: { theme: 'dark' } }))}
                >
                  <img src={ToggleLight} width="76px" height="40px" />
                </Box>
              </Grid>
            )}
          </Grid>
          <div className="dapp-menu-bottom">
            <SocialIcons color="gray" size={24} />
            <p className="dapp-menu-bottom__rights">© 2022 OtterClam All Rights Reserved</p>
            <div className="dapp-menu-bottom__audit">
              <AuditedMark />
            </div>
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
