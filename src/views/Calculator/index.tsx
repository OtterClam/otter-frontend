import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import './calculator.scss';
// import store from 'src/store';
import {
  Grid,
  InputAdornment,
  OutlinedInput,
  makeStyles,
  Zoom,
  Button,
  Slider,
  Paper,
  Box,
  Typography,
} from '@material-ui/core';
import { trim } from '../../helpers';
import { Skeleton } from '@material-ui/lab';
import { IReduxState } from '../../store/slices/state.interface';
import { useAppSelector, useAppDispatch, useWeb3Context } from 'src/hooks';
import { useTranslation, Trans } from 'react-i18next';

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
    '& .MuiSlider-rail': {
      background: theme.palette.background.default,
    },
    '& .MuiSlider-thumb': {
      border: `1px ${theme.palette.background.default} solid`,
    },
    // '& .MuiOutlinedInput-inputAdornedEnd': {
    //   width: '320px',
    // },
  },
}));

function Calculator() {
  const { t } = useTranslation();
  const styles = useStyles();
  const priceFormat = (x: string) => {
    var y = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    return y.format(parseInt(x)).toString();
  };
  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const clamBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.clam;
  });
  const sClamBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.sClam;
  });
  const marketPrice = useSelector<IReduxState, number>(state => state.app.marketPrice);

  const stakingAPY = useSelector<IReduxState, number>(state => {
    return state.app.stakingAPY;
  });

  const currentIndex = useAppSelector<string>(state => state.app.currentIndex);
  const pearlBalance = useAppSelector<string>(state => state.account.balances?.pearl);

  const totalBalance = new Intl.NumberFormat('en-US').format(
    Number(sClamBalance) + Number(pearlBalance) * Number(currentIndex),
  );

  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const trimmedsClamBalance = new Intl.NumberFormat('en-US').format(Number(sClamBalance));
  const trimeMarketPrice = trim(marketPrice, 2);

  const [sClamAmount, setsClamAmount] = useState(totalBalance);
  const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
  const [priceAtPurchase, setPriceAtPurchase] = useState(trimeMarketPrice);
  const [futureMarketPrice, setFutureMarketPrice] = useState(trimeMarketPrice);
  const [days, setDays] = useState(30);

  const [rewardsEstimation, setRewardsEstimation] = useState('0');
  const [potentialReturn, setPotentialReturn] = useState('0');
  const [percentagePotentialReturn, setPotentialPercentageReturn] = useState('0');

  const calcInitialInvestment = () => {
    const sClam = Number(sClamAmount) || 0;
    const price = parseFloat(priceAtPurchase) || 0;
    const amount = sClam * price;
    return trim(amount, 2);
  };

  const calcCurrentWealth = () => {
    const sClam = Number(sClamAmount) || 0;
    const price = parseFloat(trimeMarketPrice);
    const amount = sClam * price;
    return trim(amount, 2);
  };

  const [initialInvestment, setInitialInvestment] = useState(calcInitialInvestment());

  function calcNewBalance() {
    let value = parseFloat(rewardYield) / 100;
    value = Math.pow(value + 1, 1 / (365 * 3)) - 1 || 0;
    let balance = Number(sClamAmount);
    for (let i = 0; i < days * 3; i++) {
      balance += balance * value;
    }
    return balance;
  }

  useEffect(() => {
    const newInitialInvestment = calcInitialInvestment();
    setInitialInvestment(newInitialInvestment);
    const newBalance = calcNewBalance(); //rewardYield + sclam
    setRewardsEstimation(trim(newBalance, 6));
    const newPotentialReturn = newBalance * (parseFloat(futureMarketPrice) || 0);
    const newPercentageReturn = (newPotentialReturn / parseFloat(initialInvestment)) * 100 - 100;

    setPotentialReturn(trim(newPotentialReturn, 2));
    setPotentialPercentageReturn(trim(newPercentageReturn, 2));
  }, [sClamAmount, days, rewardYield, futureMarketPrice, priceAtPurchase, percentagePotentialReturn]);

  const trimmedPearlBalance = new Intl.NumberFormat('en-US').format(Number(pearlBalance));
  const trimmedPearlInsCLAM = new Intl.NumberFormat('en-US').format(Number(pearlBalance) * Number(currentIndex));
  const [pearlAndsCLAM, setpearlAndsCLAM] = useState(0);

  return (
    <div id="calculator-view" className={styles.root}>
      <Zoom in={true}>
        <Paper className="ohm-card calculator-card">
          <Grid className="calculator-card-grid" container direction="column" spacing={2}>
            <Grid item>
              <Box className="calculator-card-header">
                <Typography className="calc-head">{t('common.calculator')}</Typography>
                <Typography className="calc-body">{t('calculator.estimateReturns')}</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box className="calculator-top-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Typography className="metric-title">{t('common.clamPrice')}</Typography>
                    <Box color="text.secondary" className="calculator-card-metrics">
                      <Typography className="metric-body">
                        {isAppLoading ? <Skeleton width="100px" /> : `$${trimeMarketPrice}`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Typography className="metric-title">{t('common.currentApy')}</Typography>
                    <Box color="text.secondary" className="calculator-card-metrics">
                      <Typography className="metric-body">
                        {isAppLoading ? (
                          <Skeleton width="100px" />
                        ) : (
                          <>{new Intl.NumberFormat('en-US').format(Number(trimmedStakingAPY))}%</>
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Typography className="metric-title">{t('calculator.yoursClamBalance')}</Typography>
                    <Box color="text.secondary" className="calculator-card-metrics">
                      {isAppLoading ? (
                        <Skeleton width="100px" />
                      ) : (
                        <div>
                          <Typography className="metric-body">{totalBalance} sCLAM</Typography>
                          {Number(pearlBalance) > 0 ? (
                            <Typography className="metric-sub">({trimmedPearlInsCLAM} as PEARL)</Typography>
                          ) : (
                            <Typography className="metric-sub">&nbsp;</Typography>
                          )}
                        </div>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Box className="calculator-card-area">
              <Box>
                <Box className="calculator-card-action-area">
                  <Grid container spacing={3}>
                    <Grid className="calculator-metric-area" item xs={12} sm={6}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <Typography className="box-title">{t('calculator.sClamAmount')}</Typography>
                        <OutlinedInput
                          id="num-box"
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={sClamAmount}
                          onChange={e => setsClamAmount(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment className="adornment" position="end">
                              <div onClick={() => setsClamAmount(totalBalance)} className="stake-card-action-input-btn">
                                <Typography>{t('common.max')}</Typography>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid className="calculator-metric-area" item xs={12} sm={6}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <Typography className="box-title">{t('common.apy')} (%)</Typography>
                        <OutlinedInput
                          type="number"
                          placeholder="Amount"
                          id="num-box"
                          className="calculator-card-action-input"
                          value={rewardYield}
                          onChange={e => setRewardYield(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment className="adornment" position="end">
                              <div
                                onClick={() => setRewardYield(trimmedStakingAPY)}
                                className="stake-card-action-input-btn"
                              >
                                <Typography>{t('calculator.current')}</Typography>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid className="calculator-metric-area" item xs={12} sm={6}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <Typography className="box-title">{t('calculator.purchasePrice')}</Typography>
                        <OutlinedInput
                          type="number"
                          id="num-box"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={priceAtPurchase}
                          onChange={e => setPriceAtPurchase(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment className="adornment" position="end">
                              <div
                                onClick={() => setPriceAtPurchase(trimeMarketPrice)}
                                className="stake-card-action-input-btn"
                              >
                                <Typography>{t('calculator.current')}</Typography>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid className="calculator-metric-area" item xs={12} sm={6}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <Typography className="box-title">{t('calculator.futurePrice')}</Typography>
                        <OutlinedInput
                          type="number"
                          id="num-box"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={futureMarketPrice}
                          onChange={e => setFutureMarketPrice(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment className="adornment" position="end">
                              <div
                                onClick={() => setFutureMarketPrice(trimeMarketPrice)}
                                className="stake-card-action-input-btn"
                              >
                                <Typography>{t('calculator.current')}</Typography>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Box className="calculator-days-slider-wrap">
                  <Typography>{`${days} day${days > 1 ? 's' : ''}`}</Typography>
                  <Slider
                    className="calculator-days-slider"
                    min={1}
                    max={365}
                    value={days}
                    onChange={(e, newValue: any) => setDays(newValue)}
                  />
                </Box>
                <Box className="calculator-user-data">
                  <Typography className="results">{t('calculator.results')}</Typography>
                  <Box className="data-row">
                    <Typography className="data-row-name">{t('calculator.initialInvestment')}</Typography>
                    <Typography className="data-row-value">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{priceFormat(initialInvestment)}</>}
                    </Typography>
                  </Box>
                  <Box className="data-row">
                    <Typography className="data-row-name">{t('calculator.currentWealth')}</Typography>
                    <Typography className="data-row-value">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{priceFormat(calcCurrentWealth())}</>}
                    </Typography>
                  </Box>
                  <Box className="data-row">
                    <Typography className="data-row-name">s{t('calculator.rewardEstimation')}</Typography>
                    <Typography className="data-row-value">
                      {isAppLoading ? (
                        <Skeleton width="80px" />
                      ) : (
                        <>{new Intl.NumberFormat('en-US').format(Number(rewardsEstimation))} sCLAM</>
                      )}
                    </Typography>
                  </Box>
                  <Box className="data-row">
                    <Typography className="data-row-name">{t('calculator.potentialReturn')}</Typography>
                    <Typography className="data-row-value">
                      {isAppLoading ? <Skeleton width="80px" /> : <>{priceFormat(potentialReturn)}</>}
                    </Typography>
                  </Box>
                  <Box className="data-row">
                    <Typography className="data-row-name">{t('calculator.potentialPercentageGain')}</Typography>
                    <Typography className="data-row-value">
                      {isAppLoading ? (
                        <Skeleton width="80px" />
                      ) : (
                        <>
                          {Number(percentagePotentialReturn) > 0 ? '+' : ''}
                          {new Intl.NumberFormat('en-US').format(Number(percentagePotentialReturn))}%
                        </>
                      )}
                    </Typography>
                  </Box>
                  {/* <Box className="data-row">
                    <Typography>Potential number of X</Typography>
                    <Typography>
                      {isAppLoading ? <Skeleton width="80px" /> : <>{Math.floor(Number(potentialReturn) / 220000)}</>}
                    </Typography>
                  </Box> */}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Calculator;
