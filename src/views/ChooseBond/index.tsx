import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useWeb3Context } from '../../hooks';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { tabletMediaQuery } from 'src/themes/mediaQuery';

import { Box, Grid, Paper, Zoom, Slide, Typography, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import BondRowHeader from './BondRowHeader';
import BondRow from './BondRow';
import BondCard from './BondCard';
import BondDialog from '../BondDialog';
import BondSuccessDialog from '../BondDialog/BondSuccessDialog';
import BondNTFDiscountDialog from '../BondDialog/BondNFTDiscountDialog';
import './choose-bond.scss';

import apollo from 'src/lib/apolloClient';
import { Bond, BondKeys, getBond } from 'src/constants';
import { getTokenImage, trim } from '../../helpers';
import { IReduxState } from '../../store/slices/state.interface';
import { checkBondKey } from './utils';
import { NFTDiscountDetail } from '../BondDialog/BondNFTDiscountDialog/type';
import { MOCKED_NFT_OPTIONS } from '../BondDialog/BondNFTDiscountDialog/constants';

const useStyle = makeStyles(theme => {
  return {
    heroCard: {
      backgroundColor: theme.palette.mode.white,
    },
  };
});

function ChooseBond() {
  const { t } = useTranslation();
  const { chainID } = useWeb3Context();
  const style = useStyle();
  const bonds = useMemo(() => {
    return BondKeys.map(key => getBond(key, chainID));
  }, []);
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

  const history = useHistory();
  const { location } = history;

  const pathname = location.pathname;
  const matches = pathname.match(/(\/bonds)\/([a-z_0-9]*)/);
  const bondKeyMatch = matches ? matches[2] : '';
  const bondKey = checkBondKey(bondKeyMatch) ? bondKeyMatch : undefined;
  const defaultBond = bondKey ? getBond(bondKey, chainID) : undefined;

  const [selectedBond, setSelectedBond] = useState<Bond | undefined>(defaultBond);
  const [nftDialogOpen, setNftDialogOpen] = useState(false);
  const [nftSelection, setNftSelection] = useState<NFTDiscountDetail | undefined>(undefined);

  useEffect(() => {
    setSelectedBond(defaultBond);
  }, [bondKey]);

  const canSelect = true; // TODO: selectable condition
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // TODO: replace with fetched nft infos
  const MOCKED_NFT = MOCKED_NFT_OPTIONS[0];
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
            <Box className={`bond-hero-card ${style.heroCard}`}>
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
            <Box className={`bond-hero-card ${style.heroCard}`}>
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
                <Grid item xs={12} key={bond.key} onClick={() => setSelectedBond(bond)}>
                  <BondCard key={bond.key} bondKey={bond.key} nft={MOCKED_NFT} />
                </Grid>
              ))}
            </Grid>
          </Slide>
        ) : (
          <Zoom in>
            <Grid className="bond-row-container" item xs={12} aria-label="Available bonds">
              <BondRowHeader />
              {bonds.map(bond => (
                <Box key={bond.key} onClick={() => setSelectedBond(bond)}>
                  <BondRow bondKey={bond.key} nft={MOCKED_NFT} />
                </Box>
              ))}
            </Grid>
          </Zoom>
        )}
      </Paper>
      {selectedBond && (
        <BondDialog
          bond={selectedBond}
          canSelect={canSelect}
          selection={nftSelection}
          setBond={setSelectedBond}
          setSelection={setNftSelection}
          setNftDialogOpen={setNftDialogOpen}
        />
      )}
      {selectedBond && (
        <>
          <BondDialog
            bond={selectedBond}
            canSelect={canSelect}
            selection={nftSelection}
            setBond={setSelectedBond}
            setSelection={setNftSelection}
            setNftDialogOpen={setNftDialogOpen}
          />
          <BondNTFDiscountDialog
            open={nftDialogOpen}
            selection={nftSelection}
            setSelection={setNftSelection}
            onClose={() => setNftDialogOpen(false)}
          />
          <BondSuccessDialog
            bond={selectedBond}
            selection={nftSelection}
            open={successDialogOpen}
            setOpen={setSuccessDialogOpen}
          />
        </>
      )}
    </div>
  );
}

export default ChooseBond;
