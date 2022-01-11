import { Box, Container, Grid, Paper, Typography, useMediaQuery, Zoom } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DashboardHero from 'src/components/DashboardHero';
import InfoTooltip from 'src/components/InfoTooltip/InfoTooltip.jsx';
import { IReduxState } from 'src/store/slices/state.interface';
import Chart from '../../components/Chart/Chart.jsx';
import { formatCurrency, getTokenImage, trim } from '../../helpers';
import apollo from '../../lib/apolloClient';
import OtterKing from './otterking.png';
import './treasury-dashboard.scss';
import { bulletpoints, itemType, treasuryDataQuery } from './treasuryData.js';

const numberFormatter = Intl.NumberFormat('en', { maximumFractionDigits: 0 });

function TreasuryDashboard() {
  const { t } = useTranslation();
  const tooltipItems = {
    tvl: [t('dashboard.tooltipItems.tvl')],
    coin: ['MAI', 'FRAX', 'MATIC'],
    rfv: ['MAI', 'FRAX'],
    holder: ['CLAMies'],
    apy: [t('common.apy')],
    runway: [
      t('dashboard.tooltipItems.current'),
      `100K ${t('common.apy')}`,
      `50K ${t('common.apy')}`,
      `10K ${t('common.apy')}`,
    ],
    pol: [t('dashboard.tooltipItems.lpTreasury'), t('dashboard.tooltipItems.marketLP')],
  };

  const tooltipInfoMessages = {
    tvl: t('dashboard.tooltipInfoMessages.tvl'),
    mvt: t('dashboard.tooltipInfoMessages.mvt'),
    rfv: t('dashboard.tooltipInfoMessages.rfv'),
    pol: t('dashboard.tooltipInfoMessages.pol'),
    holder: t('dashboard.tooltipInfoMessages.holder'),
    staked: t('dashboard.tooltipInfoMessages.staked'),
    apy: t('dashboard.tooltipInfoMessages.apy'),
    runway: t('dashboard.tooltipInfoMessages.runway'),
    currentIndex: t('dashboard.tooltipInfoMessages.currentIndex'),
  };
  const [data, setData] = useState<any>(null);
  const [apy, setApy] = useState<any>(null);
  const [runway, setRunway] = useState(null);
  const [staked, setStaked] = useState(null);
  const [apyScale, setApyScale] = useState<number>(0);
  const [backingPerClam, setBackingPerClam] = useState<number | null>(null);
  const theme = useTheme();
  const smallerScreen = useMediaQuery('(max-width: 650px)');
  const verySmallScreen = useMediaQuery('(max-width: 379px)');

  const circSupply = useSelector<IReduxState, number>(state => state.app.circSupply);
  const totalSupply = useSelector<IReduxState, number>(state => state.app.totalSupply);
  const stakingRatio = useSelector<IReduxState, number>(state => state.app.stakingRatio);
  const marketCap = useSelector<IReduxState, number>(state => state.app.marketCap);
  const marketPrice = useSelector<IReduxState, number>(state => state.app.marketPrice);
  const pearlPrice = useSelector<IReduxState, number>(state => state.app.pearlPrice);
  const currentIndex = useSelector<IReduxState, string>(state => state.app.currentIndex);

  const displayData = [
    {
      title: t('dashboard.marketCap'),
      value: marketCap ? formatCurrency(marketCap, 0) : null,
    },
    {
      title: t('common.clamPrice'),
      value: marketPrice ? formatCurrency(marketPrice, 2) : null,
      image: getTokenImage('clam'),
    },
    {
      title: t('common.pearlPrice'),
      value: pearlPrice ? formatCurrency(pearlPrice, 2) : null,
      image: getTokenImage('pearl'),
    },
    {
      title: t('dashboard.circulatingSupply'),
      value: circSupply ? `${numberFormatter.format(circSupply)} / ${numberFormatter.format(totalSupply!)}` : null,
    },
    {
      title: t('dashboard.backingPerClam'),
      value: backingPerClam ? formatCurrency(backingPerClam, 2) : null,
    },
    {
      title: t('common.currentIndex'),
      value: currentIndex ? trim(currentIndex, 2) + ' sCLAM' : null,
      info: tooltipInfoMessages.currentIndex,
    },
  ];

  useEffect(() => {
    apollo(treasuryDataQuery).then(r => {
      // @ts-ignore
      let metrics = r?.data.protocolMetrics.map(entry =>
        // @ts-ignore
        Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
      );
      // @ts-ignore
      metrics = metrics.filter(pm => pm.treasuryMarketValue > 0);
      setData(metrics);
      // @ts-ignore
      let staked = r.data.protocolMetrics.map(entry => ({
        staked: (parseFloat(entry.sClamCirculatingSupply) / parseFloat(entry.clamCirculatingSupply)) * 100,
        timestamp: entry.timestamp,
      }));
      // @ts-ignore
      staked = staked.filter(pm => pm.staked < 100);
      setStaked(staked);
      // @ts-ignore
      let runway = metrics.filter(pm => pm.runway100k > 5);
      setRunway(runway);
      // @ts-ignore
      let apy = r.data.protocolMetrics.map(entry => ({
        apy: entry.currentAPY,
        timestamp: entry.timestamp,
      }));
      //First data point seems to be bugged?
      //Reports an APY of 3191769842703686000000, which messes with graph scale
      var sl_apy = apy.slice(0, -1);
      setApy(sl_apy);
      const apyMax = Math.max.apply(
        Math,
        (sl_apy as any).map(function (o: any) {
          return o.apy;
        }),
      );
      setApyScale(apyMax);
      const latestMetrics = (r as any).data.protocolMetrics[0];
      setBackingPerClam(latestMetrics.treasuryMarketValue / latestMetrics.clamCirculatingSupply);
    });
  }, []);

  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && 'smaller'} ${verySmallScreen && 'very-small'}`}>
      <div className="hero">
        <DashboardHero />
      </div>
      <div className="wave" />
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? '0' : '3.3rem',
          paddingRight: smallerScreen || verySmallScreen ? '0' : '3.3rem',
        }}
      >
        <Box className="hero-metrics">
          <Paper className="hero-metrics__paper">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              {displayData.map(({ title, value, info, image }, i) => (
                <Box key={i} bgcolor="mode.white" className="metric-container">
                  <Box className="metic">
                    <Typography variant="h6" color="secondary">
                      {title}
                      {info && <InfoTooltip message={info} />}
                    </Typography>
                    <Typography variant="h4" color="textPrimary">
                      {value ? value : <Skeleton width="100px" />}
                    </Typography>
                  </Box>
                  {image && <Box>{image}</Box>}
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                {
                  // @ts-ignore
                  <Chart
                    type="area"
                    data={data}
                    dataKey={['totalValueLocked']}
                    stopColor={[['#FFACA1', 'rgba(255, 172, 161, 0.5)']]}
                    headerText={t('dashboard.totalValueDeposited')}
                    // @ts-ignore
                    headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
                    bulletpointColors={bulletpoints.tvl}
                    itemNames={tooltipItems.tvl}
                    itemType={itemType.dollar}
                    infoTooltipMessage={tooltipInfoMessages.tvl}
                    // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  />
                }
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                {
                  // @ts-ignore
                  <Chart
                    type="stack"
                    data={data}
                    dataKey={['treasuryMaiMarketValue', 'treasuryFraxMarketValue', 'treasuryWmaticMarketValue']}
                    stopColor={[
                      ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
                      ['#8F5AE8', 'rgba(143, 90, 232, 0.5)'],
                      ['#2891F9', 'rgba(40, 145, 249, 0.5)'],
                      // ['#DC30EB', '#EA98F1'],
                      // ['#8BFF4D', '#4C8C2A'],
                    ]}
                    headerText={t('dashboard.marketValue')}
                    // @ts-ignore
                    headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
                    bulletpointColors={bulletpoints.coin}
                    itemNames={tooltipItems.coin}
                    itemType={itemType.dollar}
                    infoTooltipMessage={tooltipInfoMessages.mvt}
                    // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  />
                }
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                {
                  <Chart
                    type="stack"
                    data={data}
                    // @ts-ignore
                    format="currency"
                    dataKey={['treasuryMaiRiskFreeValue', 'treasuryFraxRiskFreeValue']}
                    stopColor={[
                      ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'], //MAI
                      ['#8F5AE8', 'rgba(143, 90, 232, 0.5)'], //FRAX
                      // ['#DC30EB', '#EA98F1']
                      // ['#000', '#fff'],
                      // ['#000', '#fff'],
                    ]}
                    headerText={t('dashboard.riskFree')}
                    // @ts-ignore
                    headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
                    bulletpointColors={bulletpoints.rfv}
                    itemNames={tooltipItems.rfv}
                    itemType={itemType.dollar}
                    infoTooltipMessage={tooltipInfoMessages.rfv}
                    // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  />
                }
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                {
                  // @ts-ignore
                  <Chart
                    type="area"
                    data={data}
                    dataKey={['treasuryClamMaiPOL']}
                    stopColor={[['rgba(128, 204, 131, 1)', 'rgba(128, 204, 131, 0.5)']]}
                    headerText={t('dashboard.pol') + ' CLAM-MAI'}
                    // @ts-ignore
                    headerSubText={`${data && trim(data[0].treasuryClamMaiPOL, 2)}% `}
                    dataFormat="percent"
                    bulletpointColors={bulletpoints.pol}
                    itemNames={tooltipItems.pol}
                    itemType={itemType.percentage}
                    infoTooltipMessage={tooltipInfoMessages.pol}
                    domain={[98, 'auto']}
                    isPOL={true}
                    // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  />
                }
              </Paper>
            </Grid>
            {/*
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="bar"
                  data={data}
                  dataKey={['holders']}
                  headerText="Holders"
                  stroke={[theme.palette.text.secondary]}
                  headerSubText={`${data && data[0].holders}`}
                  bulletpointColors={bulletpoints.holder}
                  itemNames={tooltipItems.holder}
                  itemType={''}
                  infoTooltipMessage={tooltipInfoMessages.holder}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>
            */}

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                {
                  // @ts-ignore
                  <Chart
                    type="area"
                    data={staked}
                    dataKey={['staked']}
                    stopColor={[['rgba(255, 220, 119, 1)', 'rgba(255, 220, 119, 0.5)']]}
                    headerText={t('dashboard.clamStaked')}
                    dataFormat="percent"
                    // @ts-ignore
                    headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
                    isStaked={true}
                    bulletpointColors={bulletpoints.staked}
                    infoTooltipMessage={tooltipInfoMessages.staked}
                    // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  />
                }
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                {
                  // @ts-ignore
                  <Chart
                    type="line"
                    scale="auto"
                    data={apy}
                    dataKey={['apy']}
                    color={theme.palette.text.primary}
                    stroke={[theme.palette.text.primary]}
                    headerText={t('dashboard.apyOverTime')}
                    dataFormat="percent"
                    // @ts-ignore
                    headerSubText={`${apy && trim(apy[0].apy, 2)}%`}
                    bulletpointColors={bulletpoints.apy}
                    itemNames={tooltipItems.apy}
                    itemType={itemType.percentage}
                    infoTooltipMessage={tooltipInfoMessages.apy}
                    domain={[0, apyScale]}

                    // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  />
                }
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                {
                  // @ts-ignore
                  <Chart
                    type="multi"
                    data={runway}
                    dataKey={['runwayCurrent', 'runway100k', 'runway50k', 'runway10k']}
                    color={theme.palette.text.primary}
                    stroke={[theme.palette.text.primary, '#2EC608', '#49A1F2', '#ff758f']}
                    headerText={t('dashboard.runway')}
                    // @ts-ignore
                    headerSubText={`${data && trim(data[0].runwayCurrent, 1)} ${t('time.days')}`}
                    dataFormat="days"
                    bulletpointColors={
                      theme.palette.text.primary == '#1D2654' ? bulletpoints.runway : bulletpoints.runway_darktheme
                    }
                    itemNames={tooltipItems.runway}
                    itemType={''}
                    infoTooltipMessage={tooltipInfoMessages.runway}
                    // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  />
                }
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
