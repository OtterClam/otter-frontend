import { Box, Grid, Link, makeStyles, Paper } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { DEFAULT_NETWORK, getAddresses } from 'src/constants';
import { AppThemeContext } from 'src/helpers/app-theme-context';
import { IReduxState } from 'src/store/slices/state.interface';
import { trim } from '../../../helpers';
import { useBonds } from '../../../hooks';
import '../sidebar.scss';
import Social from '../Social';
import ActiveMenuIcon from './ActiveMenuIcon';
import AppLogo from './AppLogo';
import AppTitle from './AppTitle';
import InactiveMenuIcon from './InactiveMenuIcon';
import ToggleDark from './toggle-dark.png';
import ToggleLight from './toggle-light.png';

const useStyles = makeStyles(theme => ({
  navbar: {
    '& .active': {
      color: theme.palette.text.secondary,
    },
  },
}));

type Page = 'dashboard' | 'stake' | 'choose_bond' | 'bonds' | 'migrate';

function NavContent() {
  const styles = useStyles();
  const bonds = useBonds();
  const location = useLocation();
  const currenTheme = useContext(AppThemeContext).name;
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
                  {checkPage(location, 'dashboard') ? <ActiveMenuIcon /> : <InactiveMenuIcon />}
                  <p>Dashboard</p>
                </div>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'stake');
                }}
                activeClassName="active"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  {checkPage(location, 'stake') ? <ActiveMenuIcon /> : <InactiveMenuIcon />}
                  <p>Stake</p>
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
                  {checkPage(location, 'bonds') ? <ActiveMenuIcon /> : <InactiveMenuIcon />}
                  <p>Bond</p>
                </div>
              </Link>

              <div className="dapp-menu-data discounts">
                <div className="bond-discounts">
                  <p>Bond discounts</p>
                  {bonds.map((bond, i) => (
                    <Link component={NavLink} to={`/bonds/${bond.value}`} key={i} className={'bond'}>
                      {bond.discount == NaN ? (
                        <Skeleton variant="text" width={'150px'} />
                      ) : (
                        <p>
                          {bond.name}
                          {!bond.deprecated && (
                            <span className="bond-pair-roi">{bond.discount && trim(bond.discount * 100, 2)}%</span>
                          )}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={'https://quickswap.exchange/#/swap?outputCurrency=' + CLAM_ADDRESS}
                target="_blank"
                rel="noreferrer"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  <InactiveMenuIcon />
                  <p>Buy CLAM2</p>
                </div>
              </Link>
              <Link
                component={NavLink}
                id="migrate-nav"
                to="/migrate"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'migrate');
                }}
                activeClassName="active"
                className="button-dapp-menu"
              >
                <div className="dapp-menu-item">
                  {checkPage(location, 'migrate') ? <ActiveMenuIcon /> : <InactiveMenuIcon />}
                  <p>Migrate</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="flex-end" flexDirection="column">
          <Grid container justifyContent="center" alignItems="center" spacing={0}>
            {currenTheme === 'dark' && (
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
            {currenTheme === 'light' && (
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
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
