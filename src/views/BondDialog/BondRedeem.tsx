import { Box, Grid, Slide } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BondKey, getBond } from 'src/constants';
import { prettifySeconds, prettyVestingPeriod, trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { redeemBond } from '../../store/actions/bond-action';
import { IPendingTxn } from '../../store/slices/pending-txns-slice';
import { IReduxState } from '../../store/slices/state.interface';
import { useTranslation, Trans } from 'react-i18next';
import BondRedeemDialog from './BondRedeemDialog';
import CustomButton from 'src/components/Button/CustomButton';
import ActionButton from '../../components/Button/ActionButton';
import SnackbarUtils from '../../store/snackbarUtils';

interface IBondRedeem {
  bondKey: BondKey;
}

function BondRedeem({ bondKey }: IBondRedeem) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const bond = getBond(bondKey, chainID);
  const [open, setOpen] = useState(false);

  const currentBlockTime = useSelector<IReduxState, number>(state => state.app.currentBlockTime);
  const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
  const bondMaturationTime = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].bondMaturationTime;
  });
  const vestingTerm = useSelector<IReduxState, number>(state => state.bonding[bondKey]?.vestingTerm);
  const interestDue = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].interestDue;
  });
  const sClamBalance = useSelector<IReduxState, string>(state => {
    //@ts-ignore
    return state.account.balances && state.account.balances.sClam;
  });
  const pendingPayout = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].pendingPayout;
  });
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => state.pendingTransactions);

  const onRedeem = async (autostake: boolean) => {
    let redeemTx: any = await dispatch(redeemBond({ address, bondKey, networkID: chainID, provider, autostake }));
    if (redeemTx.payload == true) {
      handleOpenDialog();
    }
  };

  const { t } = useTranslation();
  const vestingTime = () => {
    return prettyVestingPeriod(t, currentBlockTime, bondMaturationTime);
  };

  const fullVested = currentBlockTime > bondMaturationTime;

  const vestingPeriod = () => {
    return prettifySeconds(t, vestingTerm, 'day');
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondDiscount;
  });

  const debtRatio = useSelector<IReduxState, number>(
    state => state.bonding[bondKey] && state.bonding[bondKey].debtRatio,
  );

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        <Grid container spacing={2} justifyContent="center">
          {bond.autostake && !fullVested && (
            <Grid item xs={6}>
              <CustomButton
                bgcolor="otter.otterBlue"
                color="otter.white"
                text={t('common.claim')}
                padding="19px 30px"
                height="auto"
                fontSize="14px"
                onClick={() => {
                  if (bond.autostake && !fullVested) {
                    SnackbarUtils.warning('bonds.redeem.fullyVestedPopup', true);
                    return;
                  }
                }}
              />
            </Grid>
          )}
          {!(bond.autostake && !fullVested) && (
            <Grid item xs={6}>
              <ActionButton
                pendingTransactions={pendingTransactions}
                type={'redeem_bond_' + bondKey}
                start="Claim"
                progress="Claiming..."
                processTx={() => onRedeem(false)}
              />
            </Grid>
          )}
          {!bond.deprecated && (
            <Grid item xs={6}>
              <ActionButton
                pendingTransactions={pendingTransactions}
                type={'redeem_bond_' + bondKey + '_autostake'}
                start="Claim and Autostake"
                progress="Claiming..."
                processTx={() => onRedeem(true)}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      <BondRedeemDialog
        open={open}
        handleClose={handleCloseDialog}
        pendingPayout={trim(pendingPayout, 4)}
        balance={trim(sClamBalance, 4)}
      />
      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <p className="bond-balance-title">{t('bonds.redeem.pendingRewards')}</p>
            <p className="price-data bond-balance-value">
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : bond.autostake ? (
                `${trim(interestDue, 4)} sCLAM`
              ) : (
                `${trim(interestDue, 4)} CLAM`
              )}
            </p>
          </div>
          {!bond.autostake && (
            <div className="data-row">
              <p className="bond-balance-title">{t('bonds.redeem.claimableRewards')}</p>
              <p className="price-data bond-balance-value">
                {isBondLoading ? <Skeleton width="100px" /> : `${trim(pendingPayout, 4)} CLAM`}
              </p>
            </div>
          )}
          <div className="data-row">
            <p className="bond-balance-title">{t('bonds.redeem.timeUntilFullyVested')}</p>
            <p className="price-data bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : vestingTime()}
            </p>
          </div>

          {!bond.deprecated && (
            <div className="data-row">
              <p className="bond-balance-title">{t('common.roi')}</p>
              <p className="bond-balance-value">
                {isBondLoading ? <Skeleton width="100px" /> : `${trim(bondDiscount * 100, 2)}%`}
              </p>
            </div>
          )}

          <div className="data-row">
            <p className="bond-balance-title">{t('bonds.debtRatio')}</p>
            <p className="bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(debtRatio / 10000000, 2)}%`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">{t('bonds.vestingTerm')}</p>
            <p className="bond-balance-value">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</p>
          </div>
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
