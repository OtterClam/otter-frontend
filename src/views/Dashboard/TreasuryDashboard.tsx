import { Box, Container, Grid, Paper, Typography, useMediaQuery, Zoom } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
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
import { useContext } from 'react';
import { AppThemeContext } from 'src/helpers/app-theme-context';

const intFormatter = Intl.NumberFormat('en', { maximumFractionDigits: 0 });
const marketValues = [
  {
    label: 'Total',
    dataKey: 'treasuryMarketValue',
    stopColor: ['#FFFFFF', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'CLAM/MAI (Quick)',
    dataKey: 'treasuryMaiMarketValue',
    stopColor: ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'CLAM/MAI (Dystopia)',
    dataKey: 'treasuryDystopiaPairMaiClamMarketValue',
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
    label: 'MAI/USDC (QiDAO)',
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
  {
    label: 'DYST',
    dataKey: 'treasuryDystMarketValue',
    stopColor: ['rgba(8, 95, 142, 1)', 'rgba(8, 95, 142, 0.5)'],
  },
  {
    label: 'veDYST',
    dataKey: 'treasuryVeDystMarketValue',
    stopColor: ['rgba(8, 95, 142, 1)', 'rgba(8, 95, 142, 0.5)'],
  },
  {
    label: 'CLAM/USD+ (Dystopia)',
    dataKey: 'treasuryDystopiaPairUSDPLUSClamMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
  {
    label: 'MATIC/DYST (Dystopia)',
    dataKey: 'treasuryDystopiaPairwMaticDystMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
  {
    label: 'MAI/USDC (Dystopia)',
    dataKey: 'treasuryDystopiaPairMaiUsdcMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
  {
    label: 'FRAX/USDC (Dystopia)',
    dataKey: 'treasuryDystopiaPairFraxUsdcMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
];

// treasuryVeDystMarketValue;
// treasuryDystMarketValue;
// treasuryDystopiaPairMaiClamMarketValue;
// treasuryDystopiaPairUSDPLUSClamMarketValue;
// treasuryDystopiaPairwMaticDystMarketValue;
// treasuryDystopiaPairMaiUsdcMarketValue;
// treasuryDystopiaPairFraxUsdcMarketValue;

const tooltipColors = {
  marketValues: marketValues
    .map(p => p.stopColor)
    .map(([color1, color2]) => ({
      background: `linear-gradient(180deg, ${color1} 19%, ${color2} 100%)`,
    })),
};

const useStyles = makeStyles(theme => ({
  btngrp: {
    '&': {
      backgroundColor: theme.palette.mode.lightGray300,
    },
  },

  btn: {
    '&': {
      borderRadius: '0.3rem !important',
      height: '1.4rem',
      marginTop: '4%',
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      backgroundColor:
        useContext(AppThemeContext).name == 'light' ? theme.palette.mode.white : theme.palette.secondary.light,
    },
  },
}));

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
      burned: t('dashboard.tooltipInfoMessages.burned'),
      clamToday: t('dashboard.tooltipInfoMessages.clamToday'),
      backing: t('dashboard.tooltipInfoMessages.backing'),
    }),
    [t],
  );
  const [data, setData] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [staked, setStaked] = useState<any>(null);
  const [burnedClam, setBurnedClam] = useState<number | null>(null);
  const [burnedMarketValue, setBurnedMarketValue] = useState<number | null>(null);
  const [backingPerClam, setBackingPerClam] = useState<number | null>(null);
  const smallerScreen = useMediaQuery('(max-width: 650px)');
  const verySmallScreen = useMediaQuery('(max-width: 379px)');

  const circSupply = useSelector<IReduxState, number>(state => state.app.circSupply);
  const totalSupply = useSelector<IReduxState, number>(state => state.app.totalSupply);
  const marketCap = useSelector<IReduxState, number>(state => state.app.marketCap);
  const marketPrice = useSelector<IReduxState, number>(state => state.app.marketPrice);
  const pearlPrice = useSelector<IReduxState, number>(state => state.app.pearlPrice);
  const currentIndex = useSelector<IReduxState, string>(state => state.app.currentIndex);

  const [valueInUSD, setValueInCLAM] = useState(false);

  const styles = useStyles();

  const valueInUSDToggle = () => {
    setValueInCLAM(!valueInUSD);
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
    {
      title: t('dashboard.backingPerClam'),
      value: backingPerClam ? formatCurrency(backingPerClam, 2) : null,
      info: tooltipInfoMessages.backing,
    },
    {
      title: t('dashboard.totalValueDeposited'),
      value: data ? formatCurrency(data?.[0].totalValueLocked) : null,
      info: tooltipInfoMessages.tvl,
    },

    {
      title: t('dashboard.clamStaked'),
      value: staked ? trim(staked?.[0].staked, 2) + '%' : null,
      info: tooltipInfoMessages.staked,
    },
  ];

  const displayDataTwo = [
    {
      title: t('dashboard.burned') + ' CLAM',
      value: `${intFormatter.format(burnedClam!)} (${formatCurrency(burnedMarketValue!, 2)})`,
      info: tooltipInfoMessages.burned,
    },
    {
      title: t('dashboard.clamToday'),
      value: `${intFormatter.format(data?.[0].totalSupply - data?.[1].totalSupply)} (${formatCurrency(
        (data?.[0].totalSupply - data?.[1].totalSupply) * data?.[0].clamPrice,
        2,
      )})`,
      info: tooltipInfoMessages.clamToday,
    },
    {
      title: t('dashboard.pol') + ' CLAM-MAI',
      value: `${data && trim(data?.[0].treasuryClamMaiPOL, 2)}% `,
      info: tooltipInfoMessages.pol,
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
      setBurnedClam(latestMetrics.totalBurnedClam);
      setBurnedMarketValue(latestMetrics.totalBurnedClamMarketValue);
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
          <Grid item lg={6} md={6} sm={12} xs={12} className="ontop">
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
                  dataFormat="m"
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
                value={valueInUSD}
                exclusive
                onChange={valueInUSDToggle}
                aria-label="CLAM/USD"
                className={'toggle-button-group ' + styles.btngrp}
              >
                <ToggleButton value={false} aria-label="CLAM" className={styles.btn}>
                  {'CLAM'}
                </ToggleButton>
                <ToggleButton value={true} aria-label="USD" className={styles.btn}>
                  {'USD'}
                </ToggleButton>
              </ToggleButtonGroup>
              {
                // @ts-ignore
                <Chart
                  type="bar"
                  data={revenue}
                  dataKey={
                    valueInUSD
                      ? ['totalRevenueMarketValue', 'qiMarketValue', 'ottopiaMarketValue', 'dystMarketValue']
                      : ['totalRevenueClamAmount', 'qiClamAmount', 'ottopiaClamAmount', 'dystClamAmount']
                  }
                  stroke={[
                    [],
                    ['rgba(244, 210, 88, 1)', 'rgba(244, 210, 88, 0.5)'], //qi
                    ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'], //clam
                    ['rgba(8, 95, 142, 1)', 'rgba(8, 95, 142, 0.5)'], //dyst
                  ]}
                  headerText={t('common.treasuryRevenue')}
                  // @ts-ignore
                  headerSubText={
                    valueInUSD
                      ? `$${revenue && trim(revenue[0].totalRevenueMarketValue, 2)}`
                      : `${revenue && intFormatter.format(revenue[0].totalRevenueClamAmount)} CLAM`
                  }
                  dataFormat={valueInUSD ? 'k' : 'kClam'}
                  bulletpointColors={bulletpoints.revenue}
                  itemNames={['Total', 'Qi', 'CLAM', 'DYST']}
                  itemType={valueInUSD ? itemType.dollar : ' CLAM'}
                  infoTooltipMessage={t('dashboard.tooltipInfoMessages.treasuryRevenue')}
                />
              }
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <ToggleButtonGroup
                size="small"
                value={valueInUSD}
                exclusive
                onChange={valueInUSDToggle}
                aria-label="CLAM/USD"
                className={'toggle-button-group ' + styles.btngrp}
              >
                <ToggleButton value={false} aria-label="CLAM" className={styles.btn}>
                  {'CLAM'}
                </ToggleButton>
                <ToggleButton value={true} aria-label="USD" className={styles.btn}>
                  {'USD'}
                </ToggleButton>
              </ToggleButtonGroup>
              {
                // @ts-ignore
                <Chart
                  type="area"
                  data={data}
                  dataKey={valueInUSD ? ['marketCap'] : ['clamCirculatingSupply']}
                  stopColor={[['#FFACA1', 'rgba(255, 172, 161, 0.5)']]}
                  headerText={'CLAM ' + (valueInUSD ? t('dashboard.marketCap') : t('dashboard.circulatingSupply'))}
                  dataFormat={valueInUSD ? 'm' : 'kClam'}
                  // @ts-ignore
                  headerSubText={
                    valueInUSD
                      ? formatCurrency(data?.[0].marketCap)
                      : `${intFormatter.format(circSupply)} / ${intFormatter.format(totalSupply!)}`
                  }
                  bulletpointColors={bulletpoints.tvl}
                  itemNames={[valueInUSD ? t('dashboard.marketCap') : t('dashboard.circulatingSupply')]}
                  itemType={valueInUSD ? itemType.dollar : ' CLAM'}
                  infoTooltipMessage={
                    valueInUSD
                      ? t('dashboard.tooltipInfoMessages.marketCap')
                      : t('dashboard.tooltipInfoMessages.circulatingSupply')
                  }
                  // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              }
            </Paper>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className="ohm-card ohm-chart-card">
              <ToggleButtonGroup
                size="small"
                value={valueInUSD}
                exclusive
                onChange={valueInUSDToggle}
                aria-label="CLAM/USD"
                className={'toggle-button-group ' + styles.btngrp}
              >
                <ToggleButton value={false} aria-label="CLAM" className={styles.btn}>
                  {'CLAM'}
                </ToggleButton>
                <ToggleButton value={true} aria-label="USD" className={styles.btn}>
                  {'USD'}
                </ToggleButton>
              </ToggleButtonGroup>
              {
                // @ts-ignore
                <Chart
                  type="area"
                  data={revenue}
                  dataKey={valueInUSD ? ['cumulativeBuybackMarketValue'] : ['cumulativeBuybackClamAmount']}
                  stopColor={[['rgba(128, 204, 131, 1)', 'rgba(255, 220, 119, 0.5)']]}
                  color={[['rgba(255, 220, 119, 1)', 'rgba(255, 220, 119, 0.5)']]} //stroke
                  headerText={t('dashboard.buybacks')}
                  dataFormat={valueInUSD ? 'k' : 'kClam'}
                  // @ts-ignore
                  headerSubText={`${
                    valueInUSD
                      ? formatCurrency(revenue?.[0].buybackMarketValue)
                      : intFormatter.format(revenue?.[0].buybackClamAmount) + ' CLAM'
                  }`}
                  bulletpointColors={bulletpoints.staked}
                  itemNames={['Total Buybacks']}
                  itemType={valueInUSD ? itemType.dollar : ' CLAM'}
                  infoTooltipMessage={t('dashboard.tooltipInfoMessages.buybacks')}
                  // expandedGraphStrokeColor={theme.palette.graphStrokeColor}
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
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
