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
  Slider,
  Paper,
  Box,
  Typography,
} from '@material-ui/core';
import { trim } from '../../helpers';
import { Skeleton } from '@material-ui/lab';
import { IReduxState } from '../../store/slices/state.interface';

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

function Calculator() {
  const styles = useStyles();
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

  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const trimmedsClamBalance = trim(Number(sClamBalance), 4);
  const trimeMarketPrice = trim(marketPrice, 2);

  const [sClamAmount, setsClamAmount] = useState(trimmedsClamBalance);
  const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
  const [priceAtPurchase, setPriceAtPurchase] = useState(trimeMarketPrice);
  const [futureMarketPrice, setFutureMarketPrice] = useState(trimeMarketPrice);
  const [days, setDays] = useState(30);

  const [rewardsEstimation, setRewardsEstimation] = useState('0');
  const [potentialReturn, setPotentialReturn] = useState('0');

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

  useEffect(() => {
    const newInitialInvestment = calcInitialInvestment();
    setInitialInvestment(newInitialInvestment);
  }, [sClamAmount, priceAtPurchase]);

  const calcNewBalance = () => {
    let value = parseFloat(rewardYield) / 100;
    value = Math.pow(value - 1, 1 / (365 * 3)) - 1 || 0;
    let balance = Number(sClamAmount);
    for (let i = 0; i < days * 3; i++) {
      balance += balance * value;
    }
    return balance;
  };

  useEffect(() => {
    const newBalance = calcNewBalance();
    setRewardsEstimation(trim(newBalance, 6));
    const newPotentialReturn = newBalance * (parseFloat(futureMarketPrice) || 0);
    setPotentialReturn(trim(newPotentialReturn, 2));
  }, [days, rewardYield, futureMarketPrice, sClamAmount]);

  return (
    <div id="calculator-view" className={styles.root}>
      <Zoom in={true}>
        <Paper className="ohm-card calculator-card">
          <Grid className="calculator-card-grid" container direction="column" spacing={2}>
            <Grid item>
              <Box className="calculator-card-header">
                <Typography variant="h5">Calculator</Typography>
                <Typography variant="body2">Estimate your returns</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box className="calculator-top-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Box className="calculator-card-apy">
                      <Typography variant="h5" color="textSecondary">
                        CLAM Price
                      </Typography>
                      <Typography variant="h4">
                        {isAppLoading ? <Skeleton width="100px" /> : `$${trimeMarketPrice}`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <Box className="calculator-card-tvl">
                      <Typography variant="h5" color="textSecondary">
                        Current APY
                      </Typography>
                      <Typography variant="h4">
                        {isAppLoading ? (
                          <Skeleton width="100px" />
                        ) : (
                          <>{new Intl.NumberFormat('en-US').format(Number(trimmedStakingAPY))}%</>
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <Box className="calculator-card-index">
                      <Typography variant="h5" color="textSecondary">
                        Your sClam Balance
                      </Typography>
                      <Typography variant="h4">
                        {isAppLoading ? <Skeleton width="100px" /> : <>{trimmedsClamBalance} sClam</>}
                      </Typography>
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
                        <Typography variant="h6">sClam Amount</Typography>
                        <OutlinedInput
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={sClamAmount}
                          onChange={e => setsClamAmount(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div
                                onClick={() => setsClamAmount(trimmedsClamBalance)}
                                className="stake-card-action-input-btn"
                              >
                                <Typography>Max</Typography>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid className="calculator-metric-area" item xs={12} sm={6}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <Typography variant="h6">APY (%)</Typography>
                        <OutlinedInput
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={rewardYield}
                          onChange={e => setRewardYield(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div
                                onClick={() => setRewardYield(trimmedStakingAPY)}
                                className="stake-card-action-input-btn"
                              >
                                <Typography>Current</Typography>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid className="calculator-metric-area" item xs={12} sm={6}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <Typography className="lft" variant="h6">
                          CLAM price at purchase ($)
                        </Typography>
                        <OutlinedInput
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input lft"
                          value={priceAtPurchase}
                          onChange={e => setPriceAtPurchase(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div
                                onClick={() => setPriceAtPurchase(trimeMarketPrice)}
                                className="stake-card-action-input-btn"
                              >
                                <Typography>Current</Typography>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid className="calculator-metric-area" item xs={12} sm={6}>
                      <Box className="calculator-card-action-area-inp-wrap">
                        <Typography variant="h6">Future CLAM market price ($)</Typography>
                        <OutlinedInput
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={futureMarketPrice}
                          onChange={e => setFutureMarketPrice(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div
                                onClick={() => setFutureMarketPrice(trimeMarketPrice)}
                                className="stake-card-action-input-btn"
                              >
                                <Typography>Current</Typography>
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
                  <Box className="data-row">
                    <Typography>Your initial investment</Typography>
                    <Typography>{isAppLoading ? <Skeleton width="80px" /> : <>${initialInvestment}</>}</Typography>
                  </Box>
                  <Box className="data-row">
                    <Typography>Current wealth</Typography>
                    <Typography>{isAppLoading ? <Skeleton width="80px" /> : <>${calcCurrentWealth()}</>}</Typography>
                  </Box>
                  <Box className="data-row">
                    <Typography>CLAM rewards estimation</Typography>
                    <Typography>{isAppLoading ? <Skeleton width="80px" /> : <>{rewardsEstimation} CLAM</>}</Typography>
                  </Box>
                  <Box className="data-row">
                    <Typography>Potential return</Typography>
                    <Typography>{isAppLoading ? <Skeleton width="80px" /> : <>${potentialReturn}</>}</Typography>
                  </Box>
                  {/* <Box className="data-row">
                    <Typography>Potential number of Tesla Roadsters</Typography>
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
