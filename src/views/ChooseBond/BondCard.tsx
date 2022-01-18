import { Box, Grid, Link, Paper, Tooltip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { LabelChip, Status, StatusChip } from 'src/components/Chip';
import BondLogo from 'src/components/BondLogo';
import CustomButton from 'src/components/Button/CustomButton';
import './choose-bond.scss';

import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store/hook';
import { useTranslation } from 'react-i18next';
import { useWeb3Context } from '../../hooks';

import { Bond, BondKey, getBond } from 'src/constants';
import { priceUnits, trim, prettyShortVestingPeriod } from '../../helpers';
import { MyNFTInfo } from '../../store/actions/nft-action';
import { redeemBond } from '../../store/actions/bond-action';

import BondNFTDisplay from './BondNFTDisplay';

interface IBondProps {
  bondKey: BondKey;
  NFTs?: MyNFTInfo[];
  setRedeemedBond(value: Bond): void;
}

export function BondCard({ bondKey, NFTs, setRedeemedBond }: IBondProps) {
  const { chainID, provider } = useWeb3Context();
  const bond = getBond(bondKey, chainID);

  const { bondPrice, bondDiscount, purchased, marketPrice } = useAppSelector(state => state.bonding[bondKey]);
  const isBondLoading = useAppSelector(state => !state.bonding[bondKey]?.bondPrice ?? true);
  const fiveDayRate = useAppSelector(state => state.app.fiveDayRate);
  const priceDiff = (Number(marketPrice) ?? 0) - (bondPrice ?? 0);
  const { t } = useTranslation();

  const currentBlockTime = useAppSelector(state => state.app.currentBlockTime);
  const bondMaturationTime = useAppSelector(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].bondMaturationTime;
  });
  const vestingTime = useMemo(
    () => prettyShortVestingPeriod(t, currentBlockTime, bondMaturationTime),
    [currentBlockTime, bondMaturationTime],
  );
  const fullyVested = currentBlockTime > bondMaturationTime && bondMaturationTime > 0;

  const myBalance = useAppSelector(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].interestDue;
  });

  return (
    <Paper id={`${bond}--bond`} className="bond-card">
      <Grid container xs={12} alignItems="center" className="bond-avatar-row">
        <Grid item>
          <BondLogo bond={bond} />
        </Grid>
        <Grid item zeroMinWidth>
          <p>{bond.name}</p>
          {bond.deprecated ? (
            <LabelChip label={`${t('bonds.deprecated')}`} className="bond-name-label" />
          ) : (
            <Link color="primary" href={bond.dexUrl} target="_blank">
              <Box component="p" color="otter.otterBlue">
                {bond.type === 'lp' ? `${t('common.addLiquidity')}` : `${t('common.buyThing')}${bond.reserveUnit}`}
              </Box>
            </Link>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="space-between">
        <Grid item>{t('common.price')}</Grid>
        <Grid item className="bond-card-value">
          <p>
            <span className="currency-icon">{priceUnits(bondKey)}</span>
            {isBondLoading ? <Skeleton width="50px" /> : bond.deprecated ? '-' : trim(bondPrice, 2)}
          </p>
          {priceDiff > 0 && (
            <StatusChip status={Status.Success} label={`$${trim(priceDiff, 2)} ${t('bonds.bondDiscount')}`} />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="space-between">
        <Grid item>{t('common.roi')}</Grid>
        <Grid item className="bond-card-value">
          {isBondLoading ? <Skeleton width="50px" /> : bond.deprecated ? '-' : `${trim(bondDiscount * 100, 2)}%`}
          {!bond.deprecated && bond.autostake && (
            <Tooltip title={`* ${t('bonds.purchase.roiFourFourInfo')} `}>
              <span>{` + ${trim(fiveDayRate * 100, 2)}%*`}</span>
            </Tooltip>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="space-between">
        <Grid item>{t('bonds.purchased')}</Grid>
        <Grid item className="bond-card-value">
          {isBondLoading ? (
            <Skeleton width="80px" />
          ) : bond.deprecated ? (
            '-'
          ) : (
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(purchased)
          )}
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="space-between">
        <Grid item>{t('bonds.myBond')}</Grid>
        <Grid item className="bond-card-value">
          {myBalance ? `${trim(myBalance, 2)} ${bond.autostake ? 'sCLAM' : 'CLAM'}` : '-'}
          {NFTs && NFTs.length && <BondNFTDisplay NFTs={NFTs} />}
        </Grid>
      </Grid>

      {vestingTime && (
        <Grid container spacing={4} justifyContent="flex-end">
          <Grid item>
            {/* TODO: to be translate - components.vestingTime */}
            <p className="vesting-time-text">Redeem in {vestingTime} days</p>
          </Grid>
        </Grid>
      )}

      <Grid className="bond-card-btn-area" container spacing={1}>
        <Grid item xs={12}>
          <Link component={NavLink} to={`/bonds/${bondKey}`}>
            <CustomButton
              color="otter.white"
              bgcolor="otter.otterBlue"
              fontSize={14}
              text={`${t('common.bond')} ${bond.name}`}
            />
          </Link>
        </Grid>
        <Grid item xs={12}>
          {fullyVested && (
            <>
              {(() => {
                if (bondKey === 'mai_clam44') {
                  return (
                    <CustomButton
                      type="outline"
                      color="otter.otterBlue"
                      text={`${t('common.redeem')}`}
                      onClick={() => setRedeemedBond(bond)}
                    />
                  );
                }
                return (
                  <Link component={NavLink} to={`/bonds/${bondKey}?action=redeem`}>
                    {/* FIXME: modify desc from redeem to clain now */}
                    <CustomButton type="outline" color="otter.otterBlue" text={`${t('common.redeem')}`} />
                  </Link>
                );
              })()}
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
export default BondCard;
