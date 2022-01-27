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
import './treasury-dashboard.scss';
import { bulletpoints, itemType, treasuryDataQuery } from './treasuryData.js';

const numberFormatter = Intl.NumberFormat('en', { maximumFractionDigits: 0 });

function TreasuryDashboard() {
  const { t } = useTranslation();
  const tooltipItems = {
    tvl: [t('dashboard.tooltipItems.tvl')],
    coin: ['MAI', 'FRAX', 'MATIC', 'MAI/USDC', 'MAI/USDC(Deposited to QiDAO) ', 'Qi'],
    rfv: ['MAI', 'FRAX', 'MAI/USDC', 'MAI/USDC(Deposited to QiDAO) '],
    holder: ['CLAMies'],
    apy: [t('common.180Chest'), t('common.90Chest'), t('common.28Chest'), t('common.14Chest'), t('common.staking')],
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
  const [apyScale, setApyScale] = useState<number>(0);
  const [runway, setRunway] = useState(null);
  const [staked, setStaked] = useState(null);
  const [backingPerClam, setBackingPerClam] = useState<number | null>(null);
  const theme = useTheme();
  const smallerScreen = useMediaQuery('(max-width: 650px)');
  const verySmallScreen = useMediaQuery('(max-width: 379px)');

  const circSupply = useSelector<IReduxState, number>(state => state.app.circSupply);
  const totalSupply = useSelector<IReduxState, number>(state => state.app.totalSupply);
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
      const metrics = r?.data.protocolMetrics
        .map((entry: any) =>
          // @ts-ignore
          Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
        )
        .filter((pm: any) => pm.treasuryMarketValue > 0);
      setData(metrics);
      const staked = r?.data.protocolMetrics
        .map((entry: any) => ({
          staked: (parseFloat(entry.sClamCirculatingSupply) / parseFloat(entry.clamCirculatingSupply)) * 100,
          timestamp: entry.timestamp,
        }))
        .filter((pm: any) => pm.staked < 100);
      setStaked(staked);
      // @ts-ignore
      let runway = metrics.filter(pm => pm.runway100k > 5);
      setRunway(runway);
      const apy = r?.data.protocolMetrics
        .filter((p: any) => p.timestamp * 1000 > Date.UTC(2022, 0, 17))
        .map((entry: any) => ({
          apy: entry.currentAPY,
          diamond: entry.diamondHandAPY,
          stone: entry.stoneHandAPY,
          furry: entry.furryHandAPY,
          safe: entry.safeHandAPY,
          timestamp: entry.timestamp,
        }));
      setApy(apy);
      const apyMax = Math.max.apply(
        Math,
        (apy as any).map((o: any) => {
          return o.diamond;
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
                  <Box className="metric">
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
                    dataKey={[
                      'treasuryMaiMarketValue',
                      'treasuryFraxMarketValue',
                      'treasuryWmaticMarketValue',
                      'treasuryMaiUsdcRiskFreeValue',
                      'treasuryMaiUsdcQiInvestmentRiskFreeValue',
                      'treasuryQiMarketValue',
                    ]}
                    stopColor={[
                      ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
                      ['#8F5AE8', 'rgba(143, 90, 232, 0.5)'],
                      ['#2891F9', 'rgba(40, 145, 249, 0.5)'],
                      ['#F97328', 'rgba(249, 115, 40, 0.5)'],
                      ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'],
                      ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
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
                    dataKey={[
                      'treasuryMaiRiskFreeValue',
                      'treasuryFraxRiskFreeValue',
                      'treasuryMaiUsdcRiskFreeValue',
                      'treasuryMaiUsdcQiInvestmentRiskFreeValue',
                    ]}
                    stopColor={[
                      ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'], // MAI
                      ['#8F5AE8', 'rgba(143, 90, 232, 0.5)'], // FRAX
                      ['#DC30EB', '#EA98F1'], // MAI-USDC
                      ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'], // MAI-USDC Deposited
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
                    type="multi"
                    scale="auto"
                    data={apy}
                    dataKey={['diamond', 'stone', 'furry', 'safe', 'apy']}
                    stroke={bulletpoints.apy.map(p => p.background)}
                    headerText={t('dashboard.apyOverTime')}
                    dataFormat="percent"
                    // @ts-ignore
                    headerSubText={`Max ${apy && numberFormatter.format(apy[0].diamond)}%`}
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
