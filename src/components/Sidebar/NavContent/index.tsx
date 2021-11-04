import { useCallback, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Social from '../Social';
import ActiveMenuIcon from './icon_menu_active.png';
import InactiveMenuIcon from './icon_menu_inactive.png';
import AppLogo from './app_logo.png';
import { trim, shorten } from '../../../helpers';
import { useAddress, useBonds } from '../../../hooks';
import { Paper, Link, Box, SvgIcon } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import '../sidebar.scss';

function NavContent() {
  const [isActive] = useState();
  const bonds = useBonds();
  const location = useLocation();

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
          <Box className="branding-header">
            <Link href="https://www.otterclam.finance" target="_blank">
              <img src={AppLogo} />
            </Link>
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="stake-nav"
                to="/"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'stake');
                }}
                className={`button-dapp-menu ${isActive ? 'active' : ''}`}
              >
                <div className="dapp-menu-item">
                  <img src={checkPage(location, 'stake') ? ActiveMenuIcon : InactiveMenuIcon} />
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
                className={`button-dapp-menu ${isActive ? 'active' : ''}`}
              >
                <div className="dapp-menu-item">
                  <img src={checkPage(location, 'bonds') ? ActiveMenuIcon : InactiveMenuIcon} />
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
                          <span className="bond-pair-roi">{bond.discount && trim(bond.discount * 100, 2)}%</span>
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
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
