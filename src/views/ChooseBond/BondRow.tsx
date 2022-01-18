import { Box, Grid, Link, Paper, Tooltip, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { LabelChip, Status, StatusChip } from 'src/components/Chip';
import BondLogo from 'src/components/BondLogo';
import CustomButton from 'src/components/Button/CustomButton';
import './choose-bond.scss';

import { useMemo, MouseEvent, Dispatch, SetStateAction } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store/hook';
import { useTranslation } from 'react-i18next';
import { useWeb3Context } from '../../hooks';

import { NFTDiscountOption } from '../BondDialog/types';
import { BondKey, getBond, Bond } from 'src/constants';
import { priceUnits, trim, prettyShortVestingPeriod, localeString } from '../../helpers';
import { MyBondedNFTInfo } from 'src/store/actions/nft-action';
import { redeemBond, batchGetBondDetails } from 'src/store/actions/bond-action';
import { zeroAddress } from 'src/constants';

import BondNFTDisplay from './BondNFTDisplay';

const useStyles = makeStyles(theme => ({
  white: {
    '& ': {
      backgroundColor: theme.palette.mode.white,
    },
  },
}));
interface IBondProps {
  bondKey: BondKey;
  setRedeemedBond(value: Bond): void;
  setSelection: Dispatch<SetStateAction<NFTDiscountOption | undefined>>;
}

function BondRow({ bondKey, setRedeemedBond, setSelection }: IBondProps) {
  const { chainID, address, provider } = useWeb3Context();
  const dispatch = useAppDispatch();
  // Use BondPrice as indicator of loading.
  const isBondLoading = useAppSelector(state => !state.bonding[bondKey]?.bondPrice ?? true);
  const bond = getBond(bondKey, chainID);
  const bonding = useAppSelector(state => state.bonding[bondKey]);

  const lockedNFTs = useAppSelector(state => state.bonding[bondKey].lockedNFTs);

  const bondPrice = useAppSelector(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondPrice;
  });
  const bondDiscount = useAppSelector(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondDiscount;
  });
  const bondPurchased = useAppSelector(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].purchased;
  });
  const fiveDayRate = useAppSelector(state => state.app.fiveDayRate);
  const marketPrice = useAppSelector(state => state.bonding[bondKey]?.marketPrice);
  const myBalance = useAppSelector(state => state.account[bondKey]?.interestDue);
  const priceDiff = (Number(marketPrice) ?? 0) - (bondPrice ?? 0);
  const { t, i18n } = useTranslation();
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

  const styles = useStyles();

  const redeemable = fullyVested ? 'redeem' : 'bond';
  const history = useHistory();
  const redirect = (e: any) => {
    if (bond.key === 'mai_clam44') {
      return history.push(`/bonds/${bondKey}?action=bond`);
    }
    history.push(`/bonds/${bondKey}?action=${redeemable}`);
  };

  const handleMaiClamRedeem = async (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    dispatch(redeemBond({ address, bondKey, networkID: chainID, provider, autostake: true }));
    dispatch(
      batchGetBondDetails({
        address,
        value: null,
        provider,
        networkID: chainID,
        userBalance: '0',
        nftAddress: zeroAddress,
        tokenId: 0,
      }),
    );
    setRedeemedBond(bond);
    setSelection(undefined);
  };

  return (
    <Grid container id={`${bondKey}--bond`} className={`bond-row ${styles.white}`} onClick={redirect}>
      <Grid item xs={1} className="bond-row-logo">
        <BondLogo bond={bond} />
      </Grid>
      <Grid item xs={2} className="bond-row-value first-col">
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

      <Grid item xs={2} className="bond-row-value">
        <p className="bond-price-text">
          <span className="currency-icon">{priceUnits(bondKey)}</span>
          <span>{isBondLoading ? <Skeleton width="50px" /> : bond.deprecated ? '-' : trim(bondPrice, 2)}</span>
        </p>
        {priceDiff > 0 && (
          <StatusChip status={Status.Success} label={`$${trim(priceDiff, 2)} ${t('bonds.bondDiscount')}`} />
        )}
      </Grid>
      <Grid item xs={1} className="bond-row-value">
        <p>
          {isBondLoading ? <Skeleton /> : bond.deprecated ? '-' : `${trim(bondDiscount * 100, 2)}%`}
          {!bond.deprecated && bond.autostake && (
            <Tooltip title={`* ${t('bonds.purchase.roiFourFourInfo')} `}>
              <span>{` + ${trim(fiveDayRate * 100, 2)}%*`}</span>
            </Tooltip>
          )}
        </p>
      </Grid>
      <Grid item xs={2} className="bond-row-value">
        <p>
          {isBondLoading ? (
            <Skeleton />
          ) : bond.deprecated ? (
            '-'
          ) : (
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(bondPurchased)
          )}
        </p>
      </Grid>
      <Grid item xs={2} className="bond-row-value">
        {myBalance ? `${trim(myBalance, 2)} ${bond.autostake ? 'sCLAM' : 'CLAM'}` : '-'}
        {lockedNFTs && lockedNFTs.length ? <BondNFTDisplay NFTs={lockedNFTs} /> : ''}
      </Grid>
      <Grid item xs={2} className="bond-row-value">
        {fullyVested ? (
          <>
            {(() => {
              if (bondKey === 'mai_clam44')
                return (
                  <CustomButton
                    bgcolor="otter.otterBlue"
                    color="otter.white"
                    text={`${t('common.redeem')}`}
                    onClick={handleMaiClamRedeem}
                  />
                );
              return (
                <Link component={NavLink} to={`/bonds/${bondKey}?action=redeem`}>
                  {/* FIXME: modify desc from redeem to clain now */}
                  <CustomButton bgcolor="otter.otterBlue" color="otter.white" text={`${t('common.redeem')}`} />
                </Link>
              );
            })()}
          </>
        ) : vestingTime ? (
          <div>
            <p>
              {new Date(bondMaturationTime * 1000).toLocaleString(localeString(i18n), {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>{vestingTime}</p>
          </div>
        ) : (
          <p className="bond-row-value">-</p>
        )}
      </Grid>
    </Grid>
  );
}
export default BondRow;
