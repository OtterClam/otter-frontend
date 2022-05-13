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
import { bulletpoints, itemType, treasuryDataQuery, treasuryRevenueQuery } from './treasuryData';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const intFormatter = Intl.NumberFormat('en', { maximumFractionDigits: 0 });
const marketValues = [
  {
    label: 'Total',
    dataKey: 'treasuryMarketValue',
    stopColor: ['#FFFFFF', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'CLAM-MAI LP',
    dataKey: 'treasuryMaiMarketValue',
    stopColor: ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'FRAX',
    dataKey: 'treasuryFraxMarketValue',
    stopColor: ['#8F5AE8', 'rgba(143, 90, 232, 0.5)'],
  },
  {
    label: 'MATIC',
    dataKey: 'treasuryWmaticMarketValue',
    stopColor: ['#2891F9', 'rgba(40, 145, 249, 0.5)'],
  },
  {
    label: 'MAI/USDC(QiDAO)',
    dataKey: 'treasuryMaiUsdcQiInvestmentRiskFreeValue',
    stopColor: ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'],
  },
  {
    label: 'MAI/USDC',
    dataKey: 'treasuryMaiUsdcRiskFreeValue',
    stopColor: ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'],
  },
  {
    label: 'Qi',
    dataKey: 'treasuryQiMarketValue',
    stopColor: ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'Qi(Locked)',
    dataKey: 'treasuryOtterClamQiMarketValue',
    stopColor: ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'dQUICK',
    dataKey: 'treasuryDquickMarketValue',
    stopColor: ['#5C80B6', 'rgba(92, 128, 182, 0.5)'],
  },
  {
    label: 'Qi/MATIC',
    dataKey: 'treasuryQiWmaticQiInvestmentMarketValue',
    stopColor: ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'DAI',
    dataKey: 'treasuryDaiRiskFreeValue',
    stopColor: ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'TetuQi',
    dataKey: 'treasuryTetuQiMarketValue',
    stopColor: ['#CC48E1', '#EA94FF'],
  },
];
const tooltipColors = {
  marketValues: marketValues
    .map(p => p.stopColor)
    .map(([color1, color2]) => ({
      background: `linear-gradient(180deg, ${color1} 19%, ${color2} 100%)`,
    })),
};

function TreasuryDashboard() {
  const { t } = useTranslation();

  const tooltipItems = useMemo(
    () => ({
      tvl: [t('dashboard.tooltipItems.tvl')],
      rfv: ['MAI', 'FRAX', 'MAI/USDC(QiDAO)'],
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
  const [revenue, setRevenue] = useState<any>(null);
  const [staked, setStaked] = useState<any>(null);
  const [burned, setBurned] = useState<number | null>(null);
  const [backingPerClam, setBackingPerClam] = useState<number | null>(null);
  const smallerScreen = useMediaQuery('(max-width: 650px)');
  const verySmallScreen = useMediaQuery('(max-width: 379px)');

  const circSupply = useSelector<IReduxState, number>(state => state.app.circSupply);
  const totalSupply = useSelector<IReduxState, number>(state => state.app.totalSupply);
  const marketCap = useSelector<IReduxState, number>(state => state.app.marketCap);
  const marketPrice = useSelector<IReduxState, number>(state => state.app.marketPrice);
  const pearlPrice = useSelector<IReduxState, number>(state => state.app.pearlPrice);
  const currentIndex = useSelector<IReduxState, string>(state => state.app.currentIndex);

  const [valueInCLAM, setValueInCLAM] = useState(false);

  const valueInCLAMToggle = () => {
    setValueInCLAM(!valueInCLAM);
  };

  const displayDataOne = [
    {
      title: t('common.clamPrice'),
      value: marketPrice ? formatCurrency(marketPrice, 2) : null,
      image: getTokenImage('clam'),
    },
    {
      title: t('common.currentIndex'),
      value: currentIndex ? trim(currentIndex, 2) + ' sCLAM' : null,
      info: tooltipInfoMessages.currentIndex,
    },
    {
      title: t('common.pearlPrice'),
      value: pearlPrice ? formatCurrency(pearlPrice, 2) : null,
      image: getTokenImage('pearl'),
    },
  ];

  const displayDataTwo = [
    {
      title: t('dashboard.backingPerClam'),
      value: backingPerClam ? formatCurrency(backingPerClam, 2) : null,
    },
    {
      title: t('dashboard.clamStaked'),
      value: staked ? trim(staked?.[0].staked, 2) + '%' : null,
      info: tooltipInfoMessages.staked,
    },
    {
      title: 'Burned CLAM',
      value: burned ? Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(burned) : null,
    },
  ];

  const displayDataThree = [
    {
      title: t('dashboard.pol') + ' CLAM-MAI',
      value: `${data && trim(data[0].treasuryClamMaiPOL, 2)}% `,
    },
    {
      title: t('dashboard.totalValueDeposited'),
      value: data ? formatCurrency(data?.[0].totalValueLocked) : null,
      info: tooltipInfoMessages.tvl,
    },
    {
      title: 'Burned CLAM',
      value: burned ? intFormatter.format(burned) : null,
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
      setBurned(latestMetrics.totalBurnedClam);
    });
  }, []);

  useEffect(() => {
    apollo(treasuryRevenueQuery).then(r => {
      const revenues = r?.data.treasuryRevenues.map((entry: any) =>
        // @ts-ignore
        Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
      );
      // .filter((pm: any) => pm.treasuryMarketValue > 0);
      setRevenue(revenues);
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
              {displayDataOne.map(({ title, value, info, image }, i) => (
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

        <Grid container spacing={2} className="data-grid">
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              {
                // @ts-ignore
                <Chart
                  type="stack"
                  data={data}
                  dataKey={marketValues.map(p => p.dataKey)}
                  stopColor={marketValues.map(p => p.stopColor)}
                  headerText={t('dashboard.marketValue')}
                  // @ts-ignore
                  headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
                  bulletpointColors={tooltipColors.marketValues}
                  itemNames={marketValues.map(p => p.label)}
                  itemType={itemType.dollar}
                  infoTooltipMessage={tooltipInfoMessages.mvt}
                  // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              }
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <ToggleButtonGroup
                size="small"
                value={valueInCLAM}
                exclusive
                onChange={valueInCLAMToggle}
                aria-label="CLAM/USD"
                className="toggle-button-group"
              >
                <ToggleButton value={false} aria-label="CLAM" className="toggle-button">
                  {'CLAM'}
                </ToggleButton>
                <ToggleButton value={true} aria-label="USD">
                  {'USD'}
                </ToggleButton>
              </ToggleButtonGroup>
              {
                // @ts-ignore
                <Chart
                  type="bar"
                  data={revenue}
                  dataKey={valueInCLAM ? ['totalRevenueMarketValue'] : ['totalRevenueClamAmount']}
                  stroke={[['rgba(128, 204, 131, 1)', 'rgba(128, 204, 131, 0.5)']]}
                  headerText={t('common.treasuryRevenue')}
                  // @ts-ignore
                  headerSubText={
                    valueInCLAM
                      ? `$${revenue && trim(revenue[0].totalRevenueMarketValue, 2)}`
                      : `$${revenue && trim(revenue[0].totalRevenueClamAmount, 1)} `
                  }
                  // dataFormat="percent"
                  bulletpointColors={bulletpoints.pol}
                  itemNames={[t('common.treasuryRevenue')]}
                  itemType={valueInCLAM ? itemType.dollar : ' CLAM'}
                  infoTooltipMessage={t('dashboard.tooltipInfoMessages.treasuryRevenue')}
                />
              }
            </Paper>
          </Grid>
        </Grid>

        <Box className="hero-metrics">
          <Paper className="hero-metrics__paper">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              {displayDataTwo.map(({ title, value, info }, i) => (
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
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        <Grid container spacing={2} className="data-grid">
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <ToggleButtonGroup
                size="small"
                value={valueInCLAM}
                exclusive
                onChange={valueInCLAMToggle}
                aria-label="CLAM/USD"
                className="toggle-button-group"
              >
                <ToggleButton value={false} aria-label="CLAM" className="toggle-button">
                  {'CLAM'}
                </ToggleButton>
                <ToggleButton value={true} aria-label="USD">
                  {'USD'}
                </ToggleButton>
              </ToggleButtonGroup>
              {
                // @ts-ignore
                <Chart
                  type="area"
                  data={data}
                  dataKey={valueInCLAM ? ['marketCap'] : ['clamCirculatingSupply']}
                  stopColor={[['rgba(128, 204, 131, 1)', 'rgba(255, 220, 119, 0.5)']]}
                  color={[['rgba(255, 220, 119, 1)', 'rgba(255, 220, 119, 0.5)']]} //stroke
                  headerText={'CLAM ' + t('dashboard.circulatingSupply')}
                  dataFormat="raw"
                  // @ts-ignore
                  headerSubText={`${
                    data && circSupply
                      ? `${intFormatter.format(circSupply)} / ${intFormatter.format(totalSupply!)}`
                      : ''
                  }`}
                  bulletpointColors={bulletpoints.staked}
                  itemNames={[t('dashboard.circulatingClam')]}
                  itemType={valueInCLAM ? '' : itemType.dollar}
                  infoTooltipMessage={t('dashboard.tooltipInfoMessages.circulatingSupply')}
                  // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              }
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <ToggleButtonGroup
                size="small"
                value={valueInCLAM}
                exclusive
                onChange={valueInCLAMToggle}
                aria-label="CLAM/USD"
                className="toggle-button-group"
              >
                <ToggleButton value={false} aria-label="CLAM" className="toggle-button">
                  {'CLAM'}
                </ToggleButton>
                <ToggleButton value={true} aria-label="USD">
                  {'USD'}
                </ToggleButton>
              </ToggleButtonGroup>
              {
                // @ts-ignore
                <Chart
                  type="area"
                  data={revenue}
                  dataKey={valueInCLAM ? ['cumulativeBuybackMarketValue'] : ['cumulativeBuybackClamAmount']}
                  stopColor={[['rgba(128, 204, 131, 1)', 'rgba(255, 220, 119, 0.5)']]}
                  color={[['rgba(255, 220, 119, 1)', 'rgba(255, 220, 119, 0.5)']]} //stroke
                  headerText={'CLAM ' + t('dashboard.circulatingSupply')}
                  dataFormat="raw"
                  // @ts-ignore
                  headerSubText={`${valueInCLAM ? 'BuybackUSD' : 'BuybackCLAM'}`}
                  bulletpointColors={bulletpoints.staked}
                  itemNames={[t('dashboard.circulatingClam')]}
                  itemType={valueInCLAM ? '' : itemType.dollar}
                  infoTooltipMessage={t('dashboard.tooltipInfoMessages.circulatingSupply')}
                  // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              }
            </Paper>
          </Grid>
          <Box className="hero-metrics">
            <Paper className="hero-metrics__paper">
              <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                {displayDataThree.map(({ title, value, info }, i) => (
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
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
