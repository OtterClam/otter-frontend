import { Box, Grid, makeStyles, Paper, Slide, Typography, Zoom } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Skeleton } from '@material-ui/lab';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Bond, BondKeys, getBond } from 'src/constants';
import apollo from 'src/lib/apolloClient';
import { useAppSelector } from 'src/store/hook';
import { tabletMediaQuery } from 'src/themes/mediaQuery';
import { getTokenImage, trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { IReduxState } from '../../store/slices/state.interface';
import BondDialog from '../BondDialog';
import BondNTFDiscountDialog from '../BondDialog/BondNFTDiscountDialog';
import BondSuccessDialog from '../BondDialog/SuccessDialog/BondSuccessDialog';
import RedeemSuccessDialog from '../BondDialog/SuccessDialog/RedeemSuccessDialog';
import { NFTDiscountOption } from '../BondDialog/types';
import BondCard from './BondCard';
import BondRow from './BondRow';
import BondRowHeader from './BondRowHeader';
import './choose-bond.scss';
import { checkBondKey } from './utils';

const useStyle = makeStyles(theme => {
  return {
    heroCard: {
      backgroundColor: theme.palette.mode.white,
    },
  };
});

function ChooseBond() {
  const { t } = useTranslation();
  const { chainID, provider, address: walletAddress } = useWeb3Context();
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
  const [nftSelection, setNftSelection] = useState<NFTDiscountOption | undefined>(undefined);

  useEffect(() => {
    setSelectedBond(defaultBond);
  }, [bondKey]);

  const canSelect = useAppSelector(state => state.account.nfts)?.length > 0;
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [nftRedeemed, setNftRedeemed] = useState<NFTDiscountOption[] | undefined>(undefined);
  const [nftRedeemeds, setRedeemValue] = useState<NFTDiscountOption[] | undefined>(undefined);
  const [redeemedAmount, setRedeemedAmount] = useState(0);
  const [redeemedBond, setRedeemedBond] = useState<Bond>();
  const selectedBondKey = useMemo(() => {
    if (redeemedBond) return redeemedBond?.key;
    if (bondKey) return bondKey;
    return '';
  }, [redeemedBond, bondKey]);
  const selectedAccountBond = useAppSelector(state => state.account?.[selectedBondKey]);
  const selectedBonding = useAppSelector(state => state.bonding?.[selectedBondKey]);

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
                <Grid item xs={12} key={bond.key}>
                  <BondCard
                    key={bond.key}
                    bondKey={bond.key}
                    setRedeemedBond={setRedeemedBond}
                    setRedeemedAmount={setRedeemedAmount}
                    setNftRedeemed={setNftRedeemed}
                    setSelection={setNftSelection}
                  />
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
                  <BondRow
                    bondKey={bond.key}
                    setRedeemedBond={setRedeemedBond}
                    setSelection={setNftSelection}
                    setRedeemedAmount={setRedeemedAmount}
                    setNftRedeemed={setNftRedeemed}
                  />
                </Box>
              ))}
            </Grid>
          </Zoom>
        )}
      </Paper>
      {selectedBond && selectedAccountBond && selectedBonding && (
        <BondDialog
          bond={selectedBond}
          canSelect={canSelect}
          selection={nftSelection}
          selectedBonding={selectedBonding}
          selectedAccountBond={selectedAccountBond}
          setBond={setSelectedBond}
          setSelection={setNftSelection}
          setNftDialogOpen={setNftDialogOpen}
          setSuccessDialogOpen={setSuccessDialogOpen}
        />
      )}
      {selectedBond && getBond(bondKey!, chainID).supportNFT && (
        <>
          <BondNTFDiscountDialog
            open={nftDialogOpen}
            bond={selectedBond}
            selection={nftSelection}
            setSelection={setNftSelection}
            onClose={() => setNftDialogOpen(false)}
          />
        </>
      )}
      {selectedBond && getBond(bondKey!, chainID).supportNFT && nftSelection && (
        <BondSuccessDialog
          bond={selectedBond}
          selection={nftSelection}
          selectedBonding={selectedBonding}
          selectedAccountBond={selectedAccountBond}
          open={successDialogOpen}
          onClose={() => {
            setSuccessDialogOpen(false);
            setNftSelection(undefined);
          }}
        />
      )}
      {/** TODO: connect selected redeemed data */}
      {redeemedBond && selectedAccountBond && (
        <RedeemSuccessDialog
          bond={redeemedBond}
          amount={redeemedAmount}
          selections={nftRedeemed}
          open={!!redeemedBond}
          onClose={() => {
            setRedeemedBond(undefined);
            setNftRedeemed(undefined);
            setRedeemedAmount(0);
          }}
        />
      )}
    </div>
  );
}

export default ChooseBond;
