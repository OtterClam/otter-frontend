import {
  Box,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  TabsActions,
  Zoom,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Skeleton } from '@material-ui/lab';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UnwrapImageDark from 'src/assets/images/image_unwrap_dark.png';
import UnwrapImageLight from 'src/assets/images/image_unwrap_light.png';
import WrapImageDark from 'src/assets/images/image_wrap_dark.png';
import WrapImageLight from 'src/assets/images/image_wrap_light.png';
import ActionButton from 'src/components/Button/ActionButton';
import TabPanel from 'src/components/TabPanel';
import { trim } from 'src/helpers';
import { AppThemeContext } from 'src/helpers/app-theme-context';
import { useWeb3Context } from 'src/hooks';
import { useAppSelector, useAppDispatch } from 'src/store/hook';
import { IPendingTxn } from 'src/store/slices/pending-txns-slice';
import { approveWrapping, changeWrap } from 'src/store/slices/wrap-thunk';
import { CheckNetworkStatus } from 'src/hooks/web3/web3-context';
import './wrap.scss';
import WrapDialog from './WrapDialog';
import SnackbarUtils from '../../store/snackbarUtils';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiOutlinedInput-root': {
      borderColor: 'transparent',
      backgroundColor: theme.palette.background.default,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode.lightGray300,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode.lightGray300,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode.lightGray300,
    },
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Wrap() {
  const { t } = useTranslation();
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { provider, address, connect, chainID, checkNetworkStatus, switchToPolygonMainnet } = useWeb3Context();
  const tabsActions = useRef<TabsActions>(null);
  const currenTheme = useContext(AppThemeContext).name;
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<string>('');

  const [indexAdjustedsClam, setIndexAdjustedsClam] = useState(0);
  const [predictedPearl, setPredictedPearl] = useState(0);
  const [predictedsClam, setPredictedsClam] = useState(0);

  const isAppLoading = useAppSelector<boolean>(state => state.app.loading);
  const currentIndex = useAppSelector<string>(state => state.app.currentIndex);
  const pearlBalance = useAppSelector<string>(state => state.account.balances?.pearl);
  const sClamBalance = useAppSelector<string>(state => state.account.balances?.sClam);

  const wrapAllowance = useAppSelector<number>(state => state.account.wrapping?.sClamWrap);
  const pendingTransactions = useAppSelector<IPendingTxn[]>(state => state.pendingTransactions);

  const isWrapTab = () => view === 0;

  const wrapImage = () => {
    if (isWrapTab() && currenTheme === 'light') return WrapImageLight;
    if (isWrapTab() && currenTheme === 'dark') return WrapImageDark;
    if (!isWrapTab() && currenTheme === 'light') return UnwrapImageLight;
    if (!isWrapTab() && currenTheme === 'dark') return UnwrapImageDark;
  };

  const setMax = () => {
    if (isWrapTab()) {
      setQuantity(sClamBalance);
    } else {
      setQuantity(pearlBalance);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setQuantity('');
  };

  const onApproval = async () => {
    await dispatch(approveWrapping({ address, provider, networkID: chainID }));
  };

  const onChangeWrap = async (action: string) => {
    if (isNaN(Number(quantity)) || Number(quantity) === 0 || quantity === '0') {
      SnackbarUtils.warning('errors.enterValue', true);
    } else {
      setAction(action);
      let wrapTx: any = await dispatch(
        changeWrap({ address, action, value: String(quantity), provider, networkID: chainID }),
      );
      if (wrapTx.payload == true) {
        handleOpenDialog();
      }
    }
  };

  const hasAllowance = useCallback(
    token => {
      if (token === 'sCLAM') return wrapAllowance > 0;
      return 0;
    },
    [wrapAllowance],
  );

  const changeView = (event: any, newView: number) => {
    setView(newView);
  };

  useEffect(() => {
    if (tabsActions.current) {
      setTimeout(() => tabsActions?.current?.updateIndicator(), 300);
    }
  }, [tabsActions]);

  useEffect(() => {
    if (isWrapTab()) {
      setPredictedPearl(Number(quantity) / Number(currentIndex));
    } else {
      setPredictedsClam(Number(quantity) * Number(currentIndex));
    }
  }, [quantity, view]);

  useEffect(() => {
    setIndexAdjustedsClam(() => Number(pearlBalance) * Number(currentIndex));
  }, [pearlBalance, currentIndex, sClamBalance]);

  return (
    <div id="wrap-view" className={styles.root}>
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Grid container direction="column">
            <Grid
              container
              wrap="nowrap"
              direction={`${isSmallScreen ? 'column' : 'row'}`}
              alignItems={`${isSmallScreen ? 'center' : 'flex-start'}`}
            >
              <Grid item>
                <div className="card-header">
                  <p className="wrap-title">{t('wrap.wrapsClam')}</p>
                  <p className="wrap-description">{t('wrap.description')}</p>
                </div>
              </Grid>
              <img className="wrap-image" src={wrapImage()}></img>
            </Grid>

            <div className="wrap-area">
              {!address ? (
                <div className="wrap-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    <Box
                      bgcolor="otter.otterBlue"
                      className="app-otter-button"
                      onClick={checkNetworkStatus === CheckNetworkStatus.WRONG_CHAIN ? switchToPolygonMainnet : connect}
                    >
                      <p>
                        {checkNetworkStatus === CheckNetworkStatus.WRONG_CHAIN
                          ? t('common.switchChain')
                          : t('common.connectWallet')}
                      </p>
                    </Box>
                  </div>
                  <p className="desc-text">{t('wrap.connectWalletDescription')}</p>
                </div>
              ) : (
                <>
                  <Box className="wrap-action-area">
                    <Tabs
                      action={tabsActions}
                      centered
                      value={view}
                      indicatorColor="primary"
                      className="wrap-tab-buttons"
                      onChange={changeView}
                      aria-label="wrap tabs"
                    >
                      <Tab label="Wrap" {...a11yProps(0)} />
                      <Tab label="Unwrap" {...a11yProps(0)} />
                    </Tabs>

                    <Box className="wrap-action-row" display="flex" alignItems="center">
                      <FormControl className="ohm-input" variant="outlined" color="primary">
                        <InputLabel htmlFor="amount-input"></InputLabel>
                        <OutlinedInput
                          id="amount-input"
                          type="number"
                          placeholder="Amount"
                          className="wrap-input"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div onClick={setMax} className="wrap-input-btn">
                                <p>{t('common.max')}</p>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </FormControl>

                      <TabPanel value={view} index={0} className="wrap-tab-panel">
                        <div className="wrap-tab-buttons-group">
                          {address && hasAllowance('sCLAM') ? (
                            <ActionButton
                              pendingTransactions={pendingTransactions}
                              type="wrapping"
                              start="Wrap"
                              progress="Wrapping..."
                              processTx={() => onChangeWrap('wrap')}
                            ></ActionButton>
                          ) : (
                            <ActionButton
                              pendingTransactions={pendingTransactions}
                              type="approve_wrapping"
                              start="Approve"
                              progress="Approving..."
                              processTx={() => onApproval()}
                            ></ActionButton>
                          )}
                        </div>
                      </TabPanel>

                      <TabPanel value={view} index={1} className="wrap-tab-panel">
                        <ActionButton
                          pendingTransactions={pendingTransactions}
                          type="unwrapping"
                          start="Unwrap"
                          progress="Unwrapping..."
                          processTx={() => onChangeWrap('unwrapp')}
                        ></ActionButton>
                      </TabPanel>
                    </Box>
                    <WrapDialog
                      open={open}
                      handleClose={handleCloseDialog}
                      received={`${isWrapTab() ? trim(Number(predictedPearl), 4) : trim(Number(predictedsClam), 4)}`}
                      stakeBalance={trim(Number(sClamBalance), 4)}
                      pearlBalance={trim(Number(pearlBalance), 4)}
                      action={action}
                    />
                    <div className="help-text">
                      {address && !hasAllowance('sCLAM') && isWrapTab() && (
                        <p className="text-desc">{t('wrap.approvalInfo')}</p>
                      )}
                    </div>
                  </Box>

                  <div className={`wrap-user-data`}>
                    <div className="data-row">
                      <p className="data-row-name">{t('wrap.stakedBalance')}</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(sClamBalance), 4)} sCLAM</>}
                      </p>
                    </div>
                    <div className="data-row">
                      <p className="data-row-name">{t('wrap.wrappedBalance')}</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(pearlBalance), 4)} PEARL</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">{t('wrap.currentIndex')}</p>
                      <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{currentIndex}</>}</p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">{t('wrap.indexAdjustedBalance')}</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(indexAdjustedsClam), 4)} sCLAM</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">{t('wrap.youWillGet')}</p>
                      <p className="data-row-value">
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>
                            {isWrapTab()
                              ? `${trim(Number(predictedPearl), 4)} PEARL`
                              : `${trim(Number(predictedsClam), 4)} sCLAM`}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Wrap;
