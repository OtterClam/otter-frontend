import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useBonds } from '../../hooks';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { tabletMediaQuery } from 'src/themes/mediaQuery';

import { Box, Grid, Paper, Zoom, Slide, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import BondRowHeader from './BondRowHeader';
import BondRow from './BondRow';
import BondCard from './BondCard';
import './choose-bond.scss';

import apollo from 'src/lib/apolloClient';
import { getTokenImage, trim } from '../../helpers';
import { IReduxState } from '../../store/slices/state.interface';

function ChooseBond() {
  const { t } = useTranslation();
  const bonds = useBonds();
  const isTablet = useMediaQuery(tabletMediaQuery); // change to breakpoint query
  const [treasuryBalance, setTreasuryBalance] = useState<number | null>(null);

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const marketPrice = useSelector<IReduxState, number>(state => {
    return state.app.marketPrice;
  });

  useEffect(() => {
    apollo(`
query {
  protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
    treasuryMarketValue
  }
}`).then(r => {
      const latestMetrics = (r as any)?.data.protocolMetrics[0];
      setTreasuryBalance(latestMetrics.treasuryMarketValue);
    });
  });

  return (
    <div id="choose-bond-view">
      <Paper className="bond-paper">
        <Box className="bond-card-header">
          <p className="bond-title">
            {t('common.bond')} (
            <span className="bond-title-icon">
              {getTokenImage('clam', 24)},{getTokenImage('clam', 24)}
            </span>
            )
          </p>
        </Box>

        <Grid className="bond-hero-section" container spacing={2}>
          <Grid item xs={6}>
            <Box className="bond-hero-card" bgcolor="common.white">
              <Typography className="bond-hero-title" variant="h4" color="secondary">
                {t('common.treasuryBalance')}
              </Typography>

              <Box component="p" color="text.secondary" className="bond-hero-value">
                {!treasuryBalance ? (
                  <Skeleton width="180px" />
                ) : (
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(treasuryBalance)
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className="bond-hero-card" bgcolor="common.white">
              <Typography className="bond-hero-title" variant="h4" color="secondary">
                {t('common.clamPrice')}
              </Typography>
              <Box component="p" color="text.secondary" className="bond-hero-value">
                {isAppLoading ? <Skeleton width="180px" /> : `$${trim(marketPrice, 2)}`}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {isTablet ? (
          <Slide direction="up" in={true}>
            <Grid container className="bond-card-container">
              {bonds.map(bond => (
                <Grid item xs={12} key={bond.value}>
                  <BondCard key={bond.value} bondKey={bond.value} />
                </Grid>
              ))}
            </Grid>
          </Slide>
        ) : (
          <Zoom in>
            <Grid className="bond-row-container" item xs={12} aria-label="Available bonds">
              <BondRowHeader />
              {bonds.map(bond => (
                <BondRow key={bond.value} bondKey={bond.value} />
              ))}
            </Grid>
          </Zoom>
        )}
      </Paper>
    </div>
  );
}

export default ChooseBond;
