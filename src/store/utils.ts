import { formatEther, formatUnits } from '@ethersproject/units';
import { BigNumber, ethers } from 'ethers';
import { BondType } from '../constants';

export function getBondDiscount(marketPrice: number, bondPriceInUSD: number) {
  return (marketPrice - bondPriceInUSD) / bondPriceInUSD;
}

type GetDebtRatioPayload = {
  bondType: BondType;
  standardizedDebtRatio: any; // number for lp, BigNumber for token
};
export function getDebtRatio({ bondType, standardizedDebtRatio }: GetDebtRatioPayload): number {
  if (bondType === 'lp') return standardizedDebtRatio / 1e9;
  return standardizedDebtRatio.toNumber();
}

type GetBondQuotePayload = {
  bondType: BondType;
  payoutForValuation: number;
};
export const getBondQuote = ({ bondType, payoutForValuation }: GetBondQuotePayload) => {
  if (bondType === 'lp') {
    return payoutForValuation / 1e9;
  }
  return payoutForValuation / 1e18;
};

type GetPurchasedBondsPayload = {
  bondType: BondType;
  isBondStable: boolean;
  balanceOfTreasury: number;
  valuation: number;
  markdown: number;
  latestRoundDataAnswer: number;
};
export const getPurchasedBonds = ({
  bondType,
  isBondStable,
  balanceOfTreasury,
  valuation,
  markdown,
  latestRoundDataAnswer,
}: GetPurchasedBondsPayload) => {
  if (bondType === 'lp') {
    return (markdown / 1e18) * (valuation / 1e9);
  }
  if (isBondStable) {
    return balanceOfTreasury / 1e18;
  }
  if (latestRoundDataAnswer) {
    return (balanceOfTreasury / 1e18) * (latestRoundDataAnswer / 1e8);
  }
  throw new Error('Please give latestRoundDataAnswer to getPurchasedBonds function');
};

type GetTransformedMaxPayoutPayload = {
  originalMaxPayout: number;
};
export const getTransformedMaxPayout = ({ originalMaxPayout }: GetTransformedMaxPayoutPayload) => {
  return originalMaxPayout / 1e9;
};

export function getTransformedBondPrice(bondPriceInUSD: BigNumber) {
  return Number(formatEther(bondPriceInUSD));
}

type GetTransformedMarketPricePayload = {
  originalMarketPrice: BigNumber;
};
export const getTransformedMarketPrice = ({ originalMarketPrice }: GetTransformedMarketPricePayload) => {
  return formatUnits(originalMarketPrice, 9);
};

type GetMaxUserCanBuyPayload = {
  isOverMaxPayout: boolean;
  originalMaxPayout: BigNumber;
  bondPriceInUSD: number;
  userBalance: string;
};
export const getMaxUserCanBuy = ({
  isOverMaxPayout,
  originalMaxPayout,
  bondPriceInUSD,
  userBalance,
}: GetMaxUserCanBuyPayload) => {
  if (isOverMaxPayout) {
    return originalMaxPayout.sub(1).mul(bondPriceInUSD).div(1e9).toString();
  }
  return userBalance;
};
