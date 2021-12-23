import { Box, Grid, makeStyles, Paper, TabsActions, Zoom } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SCLAM from 'src/assets/tokens/sCLAM.png';
import { formatCurrency, trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import {
  approveMigration,
  approveUnstaking,
  claimWarmup,
  loadMigrationDetails,
  migrate,
  unstake,
} from '../../store/slices/migrate-slice';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';
import { IReduxState } from '../../store/slices/state.interface';
import ActionButton from '../../components/Button/ActionButton';
import './migrate.scss';
import { useTranslation } from 'react-i18next';

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

function Migrate() {
  const { t } = useTranslation();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { provider, readOnlyProvider, address, connect, connected, chainID } = useWeb3Context();
  const tabsActions = useRef<TabsActions>(null);

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.migrate.loading);

  const oldClamTotalSupply = useSelector<IReduxState, number>(state => state.migrate?.oldClamTotalSupply);
  const oldTreasuryBalance = useSelector<IReduxState, number>(state => state.migrate?.oldTreasuryBalance);
  const migrateProgress = useSelector<IReduxState, number>(state => state.migrate?.migrateProgress);
  const clamBalance = useSelector<IReduxState, string>(state => state.account.balances?.clam);
  const oldClamBalance = useSelector<IReduxState, string>(state => state.migrate?.oldClam);
  const oldSClamBalance = useSelector<IReduxState, string>(state => state.migrate?.oldSClam);
  const oldWarmupBalance = useSelector<IReduxState, string>(state => state.migrate?.oldWarmup);
  const canClaimWarmup = useSelector<IReduxState, boolean>(state => state.migrate?.canClaimWarmup);
  const clamAllowance = useSelector<IReduxState, number>(state => state.migrate?.clamAllowance);
  const sCLAMAllowance = useSelector<IReduxState, number>(state => state.migrate?.sCLAMAllowance);
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const onMigrate = async () => {
    await dispatch(migrate({ address, provider, networkID: chainID }));
  };

  const onUnstake = async () => {
    await dispatch(unstake({ address, value: oldSClamBalance, provider, networkID: chainID }));
  };

  const onClaimWarmup = async () => {
    await dispatch(claimWarmup({ address, provider, networkID: chainID }));
  };

  useEffect(() => {
    if (tabsActions.current) {
      setTimeout(() => tabsActions?.current?.updateIndicator(), 300);
    }
  }, [tabsActions]);
  useEffect(() => {
    if (connected) {
      dispatch(
        loadMigrationDetails({
          provider: readOnlyProvider,
          networkID: chainID,
          address,
        }),
      );
    }
  }, [connected, address]);

  return (
    <div id="stake-view" className={styles.root}>
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <p className="single-stake-title">
                  CLAM → CLAM {t('migrate.migration')} ({<img src={SCLAM} />},{<img src={SCLAM} />})
                </p>
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <p className="single-stake-subtitle">{t('migrate.oldClamSupply')}</p>
                      <Box component="p" color="text.secondary" className="single-stake-subtitle-value">
                        {oldClamTotalSupply ? trim(oldClamTotalSupply, 0) : <Skeleton width="150px" />}
                      </Box>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <p className="single-stake-subtitle">{t('migrate.oldTreasuryReserve')}</p>
                      <Box component="p" color="text.secondary" className="single-stake-subtitle-value">
                        {oldTreasuryBalance ? formatCurrency(oldTreasuryBalance, 0) : <Skeleton width="150px" />}
                      </Box>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <p className="single-stake-subtitle">{t('migrate.migrationProgress')}</p>
                      <Box component="p" color="text.secondary" className="single-stake-subtitle-value">
                        {migrateProgress ? (
                          Intl.NumberFormat('en', { style: 'percent' }).format(migrateProgress)
                        ) : (
                          <Skeleton width="150px" />
                        )}
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
                    <Box bgcolor="otter.otterBlue" className="app-otter-button" onClick={connect}>
                      <p>{t('common.connectWallet')}</p>
                    </Box>
                  </div>
                  <p className="desc-text">{t('migrate.connectWalletDescription')}</p>
                </div>
              ) : (
                <div className="migrate-table">
                  <div className="data-row">
                    <div style={{ width: '24px' }} />
                    <div className="data-row-title">{t('migrate.steps')}</div>
                    <div className="data-row-title">{t('migrate.yourAmount')}</div>
                    <div className="data-row-action" />
                  </div>
                  <div className="data-row">
                    <div className="step">1</div>
                    <div className="data-row-name data-row-expand">{t('migrate.claimWarmup')}</div>
                    <div className="data-row-value data-row-expand">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(oldWarmupBalance), 4)} sCLAM</>}
                    </div>
                    <div className="data-row-action">
                      {Number(oldWarmupBalance) === 0 && <Box className="migrate-done">{t('migrate.done')}</Box>}
                      {canClaimWarmup && (
                        <ActionButton
                          pendingTransactions={pendingTransactions}
                          type="claimWarmup"
                          start={t('migrate.claimWarmup')}
                          progress="Claiming..."
                          processTx={() => onClaimWarmup()}
                        ></ActionButton>
                      )}
                    </div>
                  </div>

                  <div className="data-row">
                    <div className="step">2</div>
                    <div className="data-row-name data-row-expand">{t('migrate.unstakeClam')}</div>
                    <div className="data-row-value data-row-expand">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(oldSClamBalance), 4)} sCLAM</>}
                    </div>
                    <div className="data-row-action">
                      {+oldSClamBalance === 0 && <Box className="migrate-done">{t('migrate.done')}</Box>}
                      {+oldSClamBalance > 0 &&
                        (sCLAMAllowance > 0 ? (
                          <ActionButton
                            pendingTransactions={pendingTransactions}
                            type="unstaking"
                            start={t('migrate.unstakeClam')}
                            progress="Unstaking..."
                            processTx={() => onUnstake()}
                          ></ActionButton>
                        ) : (
                          <ActionButton
                            pendingTransactions={pendingTransactions}
                            type="approve_unstaking"
                            start={t('common.approve')}
                            progress="Approving..."
                            processTx={() => dispatch(approveUnstaking({ address, provider, networkID: chainID }))}
                          ></ActionButton>
                        ))}
                    </div>
                  </div>

                  <div className="data-row">
                    <div className="step">3</div>
                    <div className="data-row-name data-row-expand">
                      <div>{t('migrate.migrateTo')}</div>
                      <div className="estimated-clam2">{t('migrate.estimatedClamTwo')}</div>
                    </div>
                    <div className="data-row-value data-row-expand">
                      <div>
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(oldClamBalance), 4)} CLAM</>}
                      </div>
                      <div className="estimated-clam2">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(oldClamBalance) / 5, 4)} CLAM</>}
                      </div>
                    </div>
                    <div className="data-row-action">
                      {+oldClamBalance > 0 &&
                        (clamAllowance >= +oldClamBalance ? (
                          <ActionButton
                            pendingTransactions={pendingTransactions}
                            type="migrating"
                            start={t('common.migrate')}
                            progress="Migrating..."
                            processTx={() => onMigrate()}
                          ></ActionButton>
                        ) : (
                          <ActionButton
                            pendingTransactions={pendingTransactions}
                            type="approve_migration"
                            start={t('common.approve')}
                            progress="Approving..."
                            processTx={() => dispatch(approveMigration({ address, provider, networkID: chainID }))}
                          ></ActionButton>
                        ))}
                    </div>
                  </div>

                  <Box className="data-row" bgcolor="mode.lightGray100">
                    <div />
                    <p className="data-row-name data-row-expand">{t('migrate.yourClamTwoBalance')}</p>
                    <p />
                    <p className="data-row-value data-row-action">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(clamBalance), 4)} CLAM</>}
                    </p>
                  </Box>
                </div>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Migrate;
