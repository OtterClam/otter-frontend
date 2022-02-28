import { Box, Container, Grid, Paper, Typography, useMediaQuery, Zoom } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import { useEffect, useMemo, useState } from 'react';
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

const dataKeys = {
  marketValues: [
    'treasuryMarketValue',
    'treasuryMaiMarketValue',
    'treasuryFraxMarketValue',
    'treasuryWmaticMarketValue',
    'treasuryMaiUsdcQiInvestmentRiskFreeValue',
    'treasuryQiMarketValue',
    'treasuryDquickMarketValue',
    'treasuryQiWmaticQiInvestmentMarketValue',
  ],
};
const stopColors = {
  marketValues: [
    ['#FFFFFF', 'rgba(219, 55, 55, 0.5)'],
    ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
    ['#8F5AE8', 'rgba(143, 90, 232, 0.5)'],
    ['#2891F9', 'rgba(40, 145, 249, 0.5)'],
    ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'],
    ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
    ['#5C80B6', 'rgba(92, 128, 182, 0.5)'],
    ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
  ],
};
const tooltipColors = {
  marketValues: stopColors.marketValues.map(([color1, color2]) => ({
    background: `linear-gradient(180deg, ${color1} 19%, ${color2} 100%)`,
  })),
};

function TreasuryDashboard() {
  const { t } = useTranslation();

  const tooltipItems = useMemo(
    () => ({
      tvl: [t('dashboard.tooltipItems.tvl')],
      marketValues: ['Total', 'MAI', 'FRAX', 'MATIC', 'MAI/USDC(QiDAO)', 'Qi', 'dQUICK', 'Qi/MATIC'],
      rfv: ['MAI', 'FRAX', 'MAI/USDC(QiDAO)'],
      holder: ['CLAMies'],
      apy: [t('common.180Chest'), t('common.90Chest'), t('common.28Chest'), t('common.14Chest'), t('common.staking')],
      runway: [
        t('dashboard.tooltipItems.current'),
        `100K ${t('common.apy')}`,
        `50K ${t('common.apy')}`,
        `10K ${t('common.apy')}`,
      ],
      pol: [t('dashboard.tooltipItems.lpTreasury'), t('dashboard.tooltipItems.marketLP')],
    }),
    [t],
  );

  const tooltipInfoMessages = useMemo(
    () => ({
      tvl: t('dashboard.tooltipInfoMessages.tvl'),
      mvt: t('dashboard.tooltipInfoMessages.mvt'),
      rfv: t('dashboard.tooltipInfoMessages.rfv'),
      pol: t('dashboard.tooltipInfoMessages.pol'),
      holder: t('dashboard.tooltipInfoMessages.holder'),
      staked: t('dashboard.tooltipInfoMessages.staked'),
      apy: t('dashboard.tooltipInfoMessages.apy'),
      runway: t('dashboard.tooltipInfoMessages.runway'),
      currentIndex: t('dashboard.tooltipInfoMessages.currentIndex'),
    }),
    [t],
  );
  const [data, setData] = useState<any>(null);
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
                      'treasuryMarketValue',
                      'treasuryMaiMarketValue',
                      'treasuryFraxMarketValue',
                      'treasuryWmaticMarketValue',
                      'treasuryMaiUsdcQiInvestmentRiskFreeValue',
                      'treasuryQiMarketValue',
                      'treasuryDquickMarketValue',
                      'treasuryQiWmaticQiInvestmentMarketValue',
                    ]}
                    stopColor={stopColors.marketValues}
                    headerText={t('dashboard.marketValue')}
                    // @ts-ignore
                    headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
                    bulletpointColors={tooltipColors.marketValues}
                    itemNames={tooltipItems.marketValues}
                    itemType={itemType.dollar}
                    infoTooltipMessage={tooltipInfoMessages.mvt}
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
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
