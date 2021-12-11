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
  root: {
    '& .bond-hero-block': {
      backgroundColor: 'red', //theme.palette.mode.lightGray200,
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
            <Grid item xs={6} className={`bond-hero-block ${styles.root}`}>
              <Box textAlign={`${isVerySmallScreen ? 'left' : 'center'}`}>
                <p className="bond-hero-title">{t('common.treasuryBalance')}</p>
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

            <Grid item xs={6} className={`bond-hero-block ohm-price`}>
              <Box textAlign={`${isVerySmallScreen ? 'right' : 'center'}`}>
                <p className="bond-hero-title">{t('common.clamPrice')}</p>
                <Box component="p" color="text.secondary" className="bond-hero-value">
                  {isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}
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
                      <TableCell align="center">
                        <p className="bond-table-title">{t('common.bond')}</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="bond-table-title">{t('common.price')}</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="bond-table-title">{t('common.roi')}</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="bond-table-title">{t('bonds.purchased')}</p>
                      </TableCell>
                      <TableCell align="right">
                        <p className="bond-table-title">{t('bonds.myBond')}</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="bond-table-title">{t('bonds.fullyVestedAt')}</p>
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
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bonds.map(bond => (
              <Grid item xs={12} key={bond.value}>
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
