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
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 12.7125L18.9324 13.0739C19.0756 12.7046 18.9872 12.2855 18.7071 12.0054C18.427 11.7253 18.008 11.6369 17.6386 11.7801L18 12.7125ZM7.28728 2L8.21968 2.36142C8.36286 1.99205 8.2745 1.573 7.99438 1.29289C7.71426 1.01277 7.2952 0.924424 6.92584 1.0676L7.28728 2ZM17.6386 11.7801C16.8243 12.0958 15.9381 12.2694 15.0089 12.2694V14.2694C16.1892 14.2694 17.3203 14.0485 18.3615 13.6449L17.6386 11.7801ZM15.0089 12.2694C10.9891 12.2694 7.73047 9.01073 7.73047 4.99097H5.73047C5.73047 10.1153 9.88456 14.2694 15.0089 14.2694V12.2694ZM7.73047 4.99097C7.73047 4.06186 7.90406 3.17567 8.21968 2.36142L6.35488 1.63858C5.95133 2.67968 5.73047 3.81072 5.73047 4.99097H7.73047ZM3 9.72154C3 6.63069 4.92701 3.98745 7.64872 2.9324L6.92584 1.0676C3.46009 2.41108 1 5.77779 1 9.72154H3ZM10.2784 17C6.25866 17 3 13.7413 3 9.72154H1C1 14.8459 5.15409 19 10.2784 19V17ZM17.0676 12.3511C16.0126 15.0729 13.3693 17 10.2784 17V19C14.2223 19 17.589 16.5398 18.9324 13.0739L17.0676 12.3511Z"
                      fill="white"
                    />
                  </svg>
                </Box>
              </Grid>
            )}
            {currenTheme === 'light' && (
              <Grid item>
                <Box
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
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="4" stroke="#FFDC77" stroke-width="2" />
                    <path d="M10 1V3" stroke="#FFDC77" stroke-width="2" stroke-linecap="round" />
                    <path d="M10 17V19" stroke="#FFDC77" stroke-width="2" stroke-linecap="round" />
                    <path d="M1 10L3 10" stroke="#FFDC77" stroke-width="2" stroke-linecap="round" />
                    <path d="M17 10L19 10" stroke="#FFDC77" stroke-width="2" stroke-linecap="round" />
                    <path d="M16.3643 3.63599L14.95 5.0502" stroke="#FFDC77" stroke-width="2" stroke-linecap="round" />
                    <path
                      d="M5.05029 14.9497L3.63608 16.3639"
                      stroke="#FFDC77"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M3.63574 3.63599L5.04996 5.0502"
                      stroke="#FFDC77"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M14.9497 14.9497L16.3639 16.3639"
                      stroke="#FFDC77"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
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
