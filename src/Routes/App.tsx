import { Hidden, ThemeProvider, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { CheckNetworkStatus } from 'src/hooks/web3/web3-context';
import { batchListBondNFTDiscounts, listMyNFT } from 'src/store/actions/nft-action';
import { useAppSelector } from 'src/store/hook';
import { dark as darkTheme } from 'src/themes/app';
import { NFT } from 'src/views';
import Calculator from 'src/views/Calculator';
import TreasuryDashboard from 'src/views/Dashboard/TreasuryDashboard';
import Migrate from 'src/views/Migrate';
import PearlChests from 'src/views/PearlChests';
import TopBar from '../components/Header';
import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';
import NavDrawer from '../components/Sidebar/NavDrawer';
import { BondKeys, zeroAddress } from '../constants';
import { useWeb3Context } from '../hooks';
import { batchGetBondDetails } from '../store/actions/bond-action';
import { calculateUserBondDetails, loadAccountDetails } from '../store/slices/account-slice';
import { loadAppDetails } from '../store/slices/app-slice';
import { loadTermsDetails } from '../store/slices/otter-lake-slice';
import SnackbarUtils from '../lib/snackbarUtils';
import { ChooseBond, Stake, Wrap } from '../views';
import NotFound from '../views/404/NotFound';
import './style.scss';

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: '100%',
    overflow: 'auto',
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery('(max-width: 960px)');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const { address, connect, provider, readOnlyProvider, hasCachedProvider, chainID, connected, checkNetworkStatus } =
    useWeb3Context();

  const [walletChecked, setWalletChecked] = useState(false);

  const isAppLoading = useAppSelector(state => state.app.loading);
  const isBondLoading = useAppSelector(state => state.bonding.loading);
  const isAppLoaded = useAppSelector(state => typeof state.app.marketPrice != 'undefined');

  async function loadDetails(whichDetails: string) {
    let loadProvider = readOnlyProvider;

    if (whichDetails === 'app') {
      await loadApp(loadProvider);
      loadChests(loadProvider);
    }
    if (whichDetails === 'account' && address && connected) {
      loadAccount(loadProvider);
      if (isAppLoaded) return;
      loadApp(loadProvider);
    }

    if (whichDetails === 'userBonds' && address && connected) {
      Object.values(BondKeys).map(async bondKey => {
        await dispatch(calculateUserBondDetails({ address, bondKey, provider, networkID: chainID }));
      });
    }
  }

  const loadApp = useCallback(
    async loadProvider => {
      await dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
      dispatch(
        batchGetBondDetails({
          wallet: address,
          value: null,
          provider: loadProvider,
          networkID: chainID,
          userBalance: '0',
          nftAddress: zeroAddress,
          tokenId: 0,
        }),
      );
      dispatch(batchListBondNFTDiscounts({ provider: loadProvider, networkID: chainID }));
    },
    [connected],
  );

  const loadChests = useCallback(
    provider => {
      dispatch(loadTermsDetails({ chainID, provider }));
    },
    [connected],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
      // dispatch(listMyNFT({ provider: loadProvider, wallet: address, networkID: chainID }));
    },
    [connected, address],
  );

  useEffect(() => {
    if (hasCachedProvider()) {
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      setWalletChecked(true);
    }
  }, []);

  useEffect(() => {
    if (walletChecked) {
      loadDetails('app');
      loadDetails('account');
      loadDetails('userBonds');
    }
  }, [walletChecked]);

  useEffect(() => {
    if (connected) {
      loadDetails('app');
      loadDetails('account');
      loadDetails('userBonds');
    }
  }, [connected]);

  useEffect(() => {
    if (checkNetworkStatus === CheckNetworkStatus.WRONG_CHAIN) {
      SnackbarUtils.error('errors.wrongChain', true);
    }
  }, [checkNetworkStatus]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <Switch>
      <Route exact path="/nft">
        <ThemeProvider theme={darkTheme}>
          <NFT />
        </ThemeProvider>
      </Route>
      <div className={`app ${isSmallerScreen && 'tablet'} ${isSmallScreen && 'mobile'}`}>
        <TopBar drawe={!isSmallerScreen} handleDrawerToggle={handleDrawerToggle} />
        <nav className={classes.drawer}>
          <Hidden mdUp>
            <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          </Hidden>
          <Hidden smDown>
            <Sidebar />
          </Hidden>
        </nav>

        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/stake" />
            </Route>

            <Route path="/stake">
              <Stake />
            </Route>

            <Route path="/wrap">
              <Wrap />
            </Route>

            <Route path="/pearl-chests">
              <PearlChests />
            </Route>

            <Route path="/bonds">
              <ChooseBond />
            </Route>

            <Route path="/migrate">
              <Migrate />
            </Route>

            <Route path="/calculator">
              <Calculator />
            </Route>

            <Route component={NotFound} />
          </Switch>
          <LoadingScreen show={isAppLoading} />
        </div>
      </div>
    </Switch>
  );
}

export default App;
