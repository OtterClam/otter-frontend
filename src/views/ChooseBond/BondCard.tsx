import { Box, Grid, Link, Paper, Tooltip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Dispatch, MouseEvent, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import BondLogo from 'src/components/BondLogo';
import CustomButton from 'src/components/Button/CustomButton';
import { LabelChip, Status, StatusChip } from 'src/components/Chip';
import { Bond, BondKey, getBond } from 'src/constants';
import { redeemBond } from 'src/store/actions/bond-action';
import { BondNFTDiscount, listLockedNFT, listMyNFT, LockedNFT } from 'src/store/actions/nft-action';
import { useAppDispatch, useAppSelector } from 'src/store/hook';
import { prettyShortVestingPeriod, priceUnits, trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { NFTDiscountOption } from '../BondDialog/types';
import BondNFTDisplay from './BondNFTDisplay';
import './choose-bond.scss';

interface IBondProps {
  bondKey: BondKey;
  setRedeemedBond(value: Bond): void;
  setRedeemedAmount(value: number): void;
  setNftRedeemed(value: NFTDiscountOption[]): void;
  setSelection: Dispatch<SetStateAction<NFTDiscountOption | undefined>>;
}

export function BondCard({ bondKey, setRedeemedBond, setNftRedeemed, setRedeemedAmount, setSelection }: IBondProps) {
  const { chainID, provider, address } = useWeb3Context();
  const bond = getBond(bondKey, chainID);
  const dispatch = useAppDispatch();

  const { bondPrice, bondDiscount, purchased, marketPrice, lockedNFTs } = useAppSelector(
    state => state.bonding[bondKey] || {},
  );
  const nftDiscounts = useAppSelector<BondNFTDiscount[]>(state => state.nft.bondNftDiscounts.data[bond.key]);
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

  const handleMaiClamRedeem = async (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    const mapDiscounts = nftDiscounts.reduce<Record<string, BondNFTDiscount>>((acc, cur) => {
      acc[cur.address] = cur;
      return acc;
    }, {});
    const selections = lockedNFTs.map(
      (e: LockedNFT): NFTDiscountOption => ({
        id: e.id,
        address: e.address,
        type: mapDiscounts[e.address].name.includes('Note') ? 'note' : 'nft',
        key: mapDiscounts[e.address].key,
        name: mapDiscounts[e.address].name,
        discount: mapDiscounts[e.address].discount,
        endDate: mapDiscounts[e.address].endDate,
      }),
    );
    console.log(`${bond.key} ${JSON.stringify(selections)}`);
    const redeemed = await dispatch(redeemBond({ address, bondKey, networkID: chainID, provider, autostake: true }));
    if (redeemed.payload) {
      dispatch(listMyNFT({ wallet: address, networkID: chainID, provider }));
      dispatch(
        listLockedNFT({
          bondKey,
          wallet: address,
          networkID: chainID,
          provider: provider,
        }),
      );
      setNftRedeemed(selections);
      setRedeemedBond(bond);
      setRedeemedAmount(myBalance);
      setSelection(undefined);
    }
  };
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
          {lockedNFTs?.length > 0 && <BondNFTDisplay NFTs={lockedNFTs} />}
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
                if (bond.supportNFT) {
                  return (
                    <CustomButton
                      type="outline"
                      color="otter.otterBlue"
                      text={`${t('common.redeem')}`}
                      onClick={handleMaiClamRedeem}
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
