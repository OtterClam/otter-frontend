import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useBonds } from '../../hooks';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { tabletMediaQuery } from 'src/themes/mediaQuery';

import { Box, Grid, Paper, Zoom, Slide, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { BondCard, BondRow } from './BondRow';
import './choose-bond.scss';

import apollo from 'src/lib/apolloClient';
import { getTokenImage, trim } from '../../helpers';
import { IReduxState } from '../../store/slices/state.interface';

const useStyles = makeStyles(theme => ({
  white: {
    '& ': {
      backgroundColor: theme.palette.mode.white,
    },
  },
}));

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
      const latestMetrics = (r as any).data.protocolMetrics[0];
      setTreasuryBalance(latestMetrics.treasuryMarketValue);
    });
  });

  const styles = useStyles();
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
            <Grid className="bond-row-container" container xs={12} aria-label="Available bonds">
              <Grid container className="bond-title-row">
                <Grid item xs={1} />
                <Grid item xs={2}>
                  <Typography className="bond-row-title first-col" variant="h4" color="secondary">
                    {t('common.bond')}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className="bond-row-title" variant="h4" color="secondary">
                    {t('common.price')}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="bond-row-title" variant="h4" color="secondary">
                    {t('common.roi')}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className="bond-row-title" variant="h4" color="secondary">
                    {t('bonds.purchased')}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className="bond-row-title" variant="h4" color="secondary">
                    {t('bonds.myBond')}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className="bond-row-title" variant="h4" color="secondary">
                    {t('bonds.fullyVestedAt')}
                  </Typography>
                </Grid>
              </Grid>
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
