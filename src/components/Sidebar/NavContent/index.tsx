import { useCallback, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Social from '../Social';
import ActiveMenuIcon from './ActiveMenuIcon';
import InactiveMenuIcon from './InactiveMenuIcon';
import AppLogo from './AppLogo';
import AppTitle from './AppTitle';
import { trim, shorten } from '../../../helpers';
import { useAddress, useBonds } from '../../../hooks';
import { Paper, Link, Box, SvgIcon, makeStyles, Switch, Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import '../sidebar.scss';
import { AppThemeContext } from 'src/helpers/app-theme-context';
import { BONDS } from 'src/constants';
import ToggleDark from './toggle-dark.png';
import ToggleLight from './toggle-light.png';

const useStyles = makeStyles(theme => ({
  navbar: {
    '& .active': {
      color: theme.palette.text.secondary,
    },
  },
}));

function NavContent() {
  const styles = useStyles();
  const bonds = useBonds();
  const location = useLocation();
  const currenTheme = useContext(AppThemeContext).name;

  const checkPage = useCallback((location: any, page: string): boolean => {
    const currentPath = location.pathname.replace('/', '');
    if (currentPath.indexOf('dashboard') >= 0 && page === 'dashboard') {
      return true;
    }
    if (currentPath.indexOf('stake') >= 0 && page === 'stake') {
      return true;
    }
    if ((currentPath.indexOf('bonds') >= 0 || currentPath.indexOf('choose_bond') >= 0) && page === 'bonds') {
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
                          {bond.value !== BONDS.mai_clam && (
                            <span className="bond-pair-roi">{bond.discount && trim(bond.discount * 100, 2)}%</span>
                          )}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
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
