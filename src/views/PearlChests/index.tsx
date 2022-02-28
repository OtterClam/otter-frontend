import { Link, Paper, Tab, Tabs, TabsActions, Typography, Zoom } from '@material-ui/core';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CustomButton from 'src/components/Button/CustomButton';
import PearlChestsLockup from 'src/components/PearlChestsLockup';
import PearlChestsRedeem from 'src/components/PearlChestsRedeem';
import RebaseTimer from 'src/components/RebaseTimer/RebaseTimer';
import { getTokenImage } from 'src/helpers';
import { useWeb3Context } from 'src/hooks';
import { CheckNetworkStatus } from 'src/hooks/web3/web3-context';
import { loadPearlAllowance } from 'src/store/slices/otter-lake-slice';
import chestOpenImage from './images/chest-open.png';
import './styles.scss';

enum ChestTab {
  LockUp = 'lockup',
  Redeem = 'redeem',
}

export default function PearlChests() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { tabValue, tabsActions, handleTabValueChangeEvent } = useTabs();
  const {
    address,
    connect,
    connected,
    chainID,
    provider,
    readOnlyProvider,
    checkNetworkStatus,
    switchToPolygonMainnet,
  } = useWeb3Context();
  useEffect(() => {
    if (connected) {
      dispatch(loadPearlAllowance({ address, chainID, provider }));
    }
  }, [connected, address, chainID, provider]);

  return (
    <Zoom in>
      <div className="pearl-chests__wrapper">
        <Paper className="ohm-card pearl-chests__main-wrapper">
          <div className="pearl-chests__main">
            <div className="pearl-chests__main-left">
              <Typography className="pearl-chests__title" variant="h3" component="h1">
                {t('pearlChests.title')} (<span className="pearl-chests__pearl-image">{getTokenImage('pearl')}</span>,{' '}
                <span className="pearl-chests__pearl-image">{getTokenImage('pearl')}</span>)
              </Typography>

              <Typography className="pearl-chests__subtitle" variant="h5" component="h2">
                <RebaseTimer />
              </Typography>

              <Typography className="pearl-chests__description" variant="h5" component="p">
                {t('pearlChests.description')}
              </Typography>

              <div className="pearl-chests__read-more-wrapper">
                <Link
                  href="https://otterclam.medium.com/introducing-pearl-chests-and-pearl-notes-70a61748963f"
                  target="_blank"
                >
                  <CustomButton display="inline-flex" type="outline" text={t('pearlChests.readMore')} />
                </Link>
              </div>
            </div>
            <div className="pearl-chests__main-right">
              <img className="pearl-chests__chest-image" src={chestOpenImage} />
            </div>
          </div>
          <Tabs
            action={tabsActions}
            className="pearl-chests__tabs"
            centered
            TabIndicatorProps={{ className: 'pearl-chests__tab-indicator' }}
            value={tabValue}
            onChange={handleTabValueChangeEvent}
          >
            <Tab label={t('pearlChests.lockUp.tabLabel')} value={ChestTab.LockUp} />
            <Tab label={t('pearlChests.redeem.tabLabel')} value={ChestTab.Redeem} />
          </Tabs>

          {tabValue === ChestTab.Redeem && !address && (
            <div className="pearl-chests__connect">
              <CustomButton
                className="pearl-chests__connect-btn"
                text={
                  checkNetworkStatus === CheckNetworkStatus.WRONG_CHAIN
                    ? t('common.switchChain')
                    : t('common.connectWallet')
                }
                onClick={checkNetworkStatus === CheckNetworkStatus.WRONG_CHAIN ? switchToPolygonMainnet : connect}
              />
              <Typography variant="caption" component="p" className="pearl-chests__connect-msg">
                {t('pearlChests.redeem.connect')}
              </Typography>
            </div>
          )}
        </Paper>

        {tabValue === ChestTab.LockUp && <PearlChestsLockup />}
        {tabValue === ChestTab.Redeem && address && <PearlChestsRedeem />}
      </div>
    </Zoom>
  );
}

function useTabs() {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const [tabValue, setTabValue] = useState(query.get('tab') ?? ChestTab.LockUp);
  const tabsActions = useRef<TabsActions>(null);

  const handleTabValueChangeEvent = useCallback(async (e: ChangeEvent<{}>, newValue: ChestTab) => {
    setTabValue(newValue);
  }, []);

  // a workaround for tab indicator
  useEffect(() => {
    if (tabsActions.current) {
      setTimeout(() => {
        tabsActions.current?.updateIndicator();
      }, 300);
    }
  }, [tabsActions.current]);

  useEffect(() => {
    history.push({
      pathname: location.pathname,
      search: '?tab=' + tabValue,
    });
  }, [tabValue]);

  return {
    tabValue,
    handleTabValueChangeEvent,
    tabsActions,
  };
}
