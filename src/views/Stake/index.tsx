import {
  Box,
  Divider,
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
  Typography,
  Zoom,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import InfoTooltip from 'src/components/InfoTooltip/InfoTooltip.jsx';
import ActionButton from '../../components/Button/ActionButton';
import RebaseTimer from '../../components/RebaseTimer/RebaseTimer';
import TabPanel from '../../components/TabPanel';
import { trim } from '../../helpers';
import { useBonds, useWeb3Context } from '../../hooks';
import { IPendingTxn } from '../../store/slices/pending-txns-slice';
import { changeApproval, changeStake, claimWarmup } from '../../store/slices/stake-thunk';
import { IReduxState } from '../../store/slices/state.interface';
import './stake.scss';
import StakeDialog from './StakeDialog';
import IconPearlChest from 'src/assets/icons/icon_pearl_chest_3.png';
import { CheckNetworkStatus } from 'src/hooks/web3/web3-context';
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
    '& .data-row-name-small': {
      color: theme.palette.mode.darkGray200,
    },
    '& .data-row-value-small': {
      color: theme.palette.mode.darkGray200,
    },
  },
}));

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
});

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Stake() {
  const { t } = useTranslation();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { provider, address, connect, chainID, checkNetworkStatus, switchToPolygonMainnet } = useWeb3Context();
  const tabsActions = useRef<TabsActions>(null);

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<string>('');

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const currentIndex = useSelector<IReduxState, string>(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector<IReduxState, number>(state => state.app.fiveDayRate);
  const clamBalance = useSelector<IReduxState, string>(state => state.account.balances?.clam);
  const sClamBalance = useSelector<IReduxState, string>(state => state.account.balances?.sClam);
  const stakeAllowance = useSelector<IReduxState, number>(state => state.account.staking?.clamStake);
  const unstakeAllowance = useSelector<IReduxState, number>(state => state.account.staking?.sClamUnstake);
  const warmupBalance = useSelector<IReduxState, string>(state => state.account.staking?.warmup);
  const canClaimWarmup = useSelector<IReduxState, boolean>(state => state.account.staking?.canClaimWarmup);
  const stakingRebase = useSelector<IReduxState, number>(state => state.app.stakingRebase);
  const stakingAPY = useSelector<IReduxState, number>(state => state.app.stakingAPY);
  const stakingTVL = useSelector<IReduxState, number>(state => state.app.stakingTVL);
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => state.pendingTransactions);
  const chestAPY = useSelector<IReduxState, number>(state => _.max(state.lake.terms.map(p => p.apy)) || 0);

  const pearlBalance = useSelector<IReduxState, string>(state => state.account.balances?.pearl);

  const setMax = () => {
    if (view === 0) {
      setQuantity(clamBalance);
    } else {
      setQuantity(sClamBalance);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const onSeekApproval = async (token: string) => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    //@ts-ignore
    if (isNaN(quantity) || quantity === 0 || quantity === '') {
      SnackbarUtils.warning('errors.enterValue', true);
    } else {
      setAction(action);
      let stakeTx: any = await dispatch(
        changeStake({ address, action, value: String(quantity), provider, networkID: chainID }),
      );
      if (stakeTx.payload == true) {
        handleOpenDialog();
      }
    }
  };

  const onClaimWarmup = async () => {
    await dispatch(claimWarmup({ address, provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === 'CLAM') return stakeAllowance > 0;
      if (token === 'sCLAM') return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const changeView = (event: any, newView: number) => {
    setView(newView);
  };

  //Include PEARL balance
  const pearlInsCLAM = Number(pearlBalance) * Number(currentIndex);

  //Include Bonded sCLAM balance
  const bonds = useBonds();
  const bondedBalances = useSelector<IReduxState, any[]>(state => {
    //@ts-ignore
    return bonds.map(bond => state.account[bond.value] && state.account[bond.value].interestDue);
  });
  const totalBondedBalance = bondedBalances.reduce((a, b) => a + b, 0);

  //Find total value of all assets & use for nextRewardValue calculation
  const totalBalance = pearlInsCLAM + Number(sClamBalance) + Number(totalBondedBalance);
  const trimmedTotalBalance = trim(Number(totalBalance), 4);

  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim(
    (Number(stakingRebasePercentage) / 100) * (Number(trimmedTotalBalance) + Number(warmupBalance)),
    4,
  );
  const trimmedSClamBalance = trim(Number(sClamBalance), 4);

  useEffect(() => {
    if (tabsActions.current) {
      setTimeout(() => tabsActions?.current?.updateIndicator(), 300);
    }
  }, [tabsActions]);

  return (
    <div id="stake-view" className={styles.root}>
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <p className="single-stake-title">
                  {t('stake.clamStaking')} ({String.fromCodePoint(0x1f9a6)}, {String.fromCodePoint(0x1f9a6)})
                </p>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <p className="single-stake-subtitle">{t('common.apy')}</p>
                      <Box component="p" color="text.secondary" className="single-stake-subtitle-value">
                        {stakingAPY ? percentFormatter.format(stakingAPY) : <Skeleton width="150px" />}
                      </Box>
                      <Box
                        component="p"
                        color="text.secondary"
                        className="single-stake-chest-value"
                        bgcolor="mode.lightGray200"
                      >
                        <img src={IconPearlChest} />
                        <Typography color="textPrimary">{t('stake.chestAPY')}</Typography>
                        {chestAPY ? percentFormatter.format(chestAPY) : <Skeleton width="60px" />}
                        <InfoTooltip message={t('stake.chestAPYInfo')} />
                      </Box>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <p className="single-stake-subtitle">{t('common.tvl')}</p>
                      <Box component="p" color="text.secondary" className="single-stake-subtitle-value">
                        {stakingTVL ? (
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Box>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <p className="single-stake-subtitle">{t('common.currentIndex')}</p>
                      <Box component="p" color="text.secondary" className="single-stake-subtitle-value">
                        {currentIndex ? <>{trim(Number(currentIndex), 3)} sCLAM</> : <Skeleton width="150px" />}
                      </Box>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
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
                  <p className="desc-text">{t('stake.connectWalletDescription')}</p>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      action={tabsActions}
                      centered
                      value={view}
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(0)} />
                    </Tabs>

                    <Box className="stake-action-row" display="flex" alignItems="center">
                      <FormControl className="ohm-input" variant="outlined" color="primary">
                        <InputLabel htmlFor="amount-input"></InputLabel>
                        <OutlinedInput
                          id="amount-input"
                          type="number"
                          placeholder="Amount"
                          className="stake-input"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div onClick={setMax} className="stake-input-btn">
                                <p>{t('common.max')}</p>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </FormControl>

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        <div className="stake-tab-buttons-group">
                          {address && hasAllowance('CLAM') ? (
                            <ActionButton
                              pendingTransactions={pendingTransactions}
                              type="staking"
                              start="Stake"
                              progress="Staking..."
                              processTx={() => onChangeStake('stake')}
                            ></ActionButton>
                          ) : (
                            <ActionButton
                              pendingTransactions={pendingTransactions}
                              type="approve_staking"
                              start="Approve"
                              progress="Approving..."
                              processTx={() => onSeekApproval('CLAM')}
                            ></ActionButton>
                          )}
                          {canClaimWarmup && (
                            <ActionButton
                              pendingTransactions={pendingTransactions}
                              type="claimWarmup"
                              start="Claim Warmup"
                              progress="Claiming..."
                              processTx={() => onClaimWarmup()}
                            ></ActionButton>
                          )}
                        </div>
                      </TabPanel>

                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {address && hasAllowance('sCLAM') ? (
                          <ActionButton
                            pendingTransactions={pendingTransactions}
                            type="unstaking"
                            start="Unstake CLAM"
                            progress="Unstaking..."
                            processTx={() => onChangeStake('unstake')}
                          ></ActionButton>
                        ) : (
                          <ActionButton
                            pendingTransactions={pendingTransactions}
                            type="approve_unstaking"
                            start="Approve"
                            progress="Approving..."
                            processTx={() => onSeekApproval('sCLAM')}
                          ></ActionButton>
                        )}
                      </TabPanel>
                    </Box>
                    <StakeDialog
                      open={open}
                      handleClose={handleCloseDialog}
                      stakingRebasePercentage={stakingRebasePercentage}
                      quantity={trim(Number(quantity), 4)}
                      balance={trim(Number(clamBalance), 4)}
                      stakeBalance={new Intl.NumberFormat('en-US').format(Number(trimmedSClamBalance))}
                      nextRewardValue={nextRewardValue}
                      action={action}
                    />
                    <div className="help-text">
                      {address && ((!hasAllowance('CLAM') && view === 0) || (!hasAllowance('sCLAM') && view === 1)) && (
                        <p className="text-desc">{t('stake.approvalInfo')}</p>
                      )}
                    </div>
                  </Box>

                  <div className={`stake-user-data`}>
                    {Number(warmupBalance) > 0 && (
                      <div className="data-row">
                        <p className="data-row-name-warmup">{t('stake.balanceInWarmup')}</p>
                        <p className="data-row-value">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(warmupBalance), 4)} CLAM</>}
                        </p>
                      </div>
                    )}

                    <div className="data-row">
                      <p className="data-row-name">{t('common.yourBalance')}</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(clamBalance), 4)} CLAM</>}
                      </p>
                    </div>
                    <div className="data-row">
                      <div className="data-row-name">
                        {t('stake.stakedBalance')}
                        <InfoTooltip message={t('stake.infoTooltips.stakedBalance')} />
                      </div>

                      <p className="data-row-value">
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>{new Intl.NumberFormat('en-US').format(Number(trimmedTotalBalance))} sCLAM</>
                        )}
                      </p>
                    </div>
                    <div className="data-row">
                      <div className="data-row-name-small">
                        sCLAM {t('common.balance')}
                        <InfoTooltip message={t('stake.infoTooltips.sClamBalance')} />
                      </div>
                      <p className="data-row-value-small">
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>{new Intl.NumberFormat('en-US').format(Number(trimmedSClamBalance))} sCLAM</>
                        )}
                      </p>
                    </div>
                    <div className="data-row">
                      <div className="data-row-name-small">
                        sCLAM Bonded
                        <InfoTooltip message={t('stake.infoTooltips.sClamBonded')} />
                      </div>
                      <p className="data-row-value-small">
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>{new Intl.NumberFormat('en-US').format(Number(trim(totalBondedBalance, 4)))} sCLAM</>
                        )}
                      </p>
                    </div>
                    <div className="data-row">
                      <div className="data-row-name-small">
                        PEARL {t('common.balance')}
                        <InfoTooltip message={t('stake.infoTooltips.pearl')} />
                      </div>
                      <p className="data-row-value-small">
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>{new Intl.NumberFormat('en-US').format(Number(trim(pearlBalance, 4)))} PEARL</>
                        )}
                      </p>
                    </div>
                    <Divider />
                    <div className="data-row">
                      <div className="data-row-name">
                        {t('stake.nextRewardAmount')}
                        <InfoTooltip message={t('stake.infoTooltips.nextReward')} />
                      </div>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sCLAM</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">{t('stake.nextRewardYield')}</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">{t('stake.roiFiveDay')}</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(fiveDayRate) * 100, 4)}%</>}
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

export default Stake;
