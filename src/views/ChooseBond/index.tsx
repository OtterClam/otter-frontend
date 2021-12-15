import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Zoom,
  makeStyles,
  Typography,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Skeleton } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apollo from 'src/lib/apolloClient';
import { getTokenImage, trim } from '../../helpers';
import { useBonds } from '../../hooks';
import { IReduxState } from '../../store/slices/state.interface';
import { BondDataCard, BondTableRow } from './BondRow';
import './choose-bond.scss';
import { useTranslation } from 'react-i18next';

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
  const isSmallScreen = useMediaQuery('(max-width: 733px)'); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery('(max-width: 420px)');
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
      <Zoom in={true}>
        <Paper>
          <Box className="card-header">
            <p className="bond-title">
              {t('common.bond')} (
              <span className="bond-title-span">
                {getTokenImage('clam', 24)},{getTokenImage('clam', 24)}
              </span>
              )
            </p>
          </Box>

          <Grid container item xs={12} style={{ margin: '10px 0px 20px' }} className="bond-hero">
            <Grid item className={`bond-hero-block ${styles.white}`}>
              <Box textAlign={`${isVerySmallScreen ? 'left' : 'center'}`}>
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

            <Grid item className={`bond-hero-block ${styles.white}`}>
              <Box textAlign={`${isVerySmallScreen ? 'right' : 'center'}`}>
                <Typography className="bond-hero-title" variant="h4" color="secondary">
                  {t('common.clamPrice')}
                </Typography>
                <Box component="p" color="text.secondary" className="bond-hero-value">
                  {isAppLoading ? <Skeleton width="180px" /> : `$${trim(marketPrice, 2)}`}
                </Box>
              </Box>
            </Grid>
          </Grid>

          {!isSmallScreen && (
            <Grid container item>
              <TableContainer className="bond-table-container">
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell className="extra-wide" align="center">
                        <Typography className="bond-table-title" variant="h4" color="secondary">
                          {t('common.bond')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className="bond-table-title" variant="h4" color="secondary">
                          {t('common.price')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className="bond-table-title" variant="h4" color="secondary">
                          {t('common.roi')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className="bond-table-title" variant="h4" color="secondary">
                          {t('bonds.purchased')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className="bond-table-title" variant="h4" color="secondary">
                          {t('bonds.myBond')}
                        </Typography>
                      </TableCell>
                      <TableCell className="extra-wide" align="center">
                        <Typography className="bond-table-title" variant="h4" color="secondary">
                          {t('bonds.fullyVestedAt')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bonds.map(bond => (
                      <BondTableRow key={bond.value} bondKey={bond.value} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className={`ohm-card-container`}>
          <Grid container item spacing={2}>
            {bonds.map(bond => (
              <Grid className={`${styles.white}`} item xs={12} key={bond.value}>
                <BondDataCard key={bond.value} bondKey={bond.value} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ChooseBond;
