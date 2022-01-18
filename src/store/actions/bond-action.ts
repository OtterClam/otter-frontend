import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseEther } from '@ethersproject/units';

import { fetchAccountSuccess } from '../slices/account-slice';
import { calculateUserBondDetails, getBalances } from '../slices/account-slice';
import { fetchPendingTxns, clearPendingTxn } from '../slices/pending-txns-slice';
import { BondDetails } from '../slices/bond-slice';

import { ethers, constants, BigNumber } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BondingCalcContract, AggregatorV3InterfaceABI, ERC721 } from '../../abi';

import { getMarketPrice, contractForBond, contractForReserve, getTokenPrice } from '../../helpers';
import { BondKey, BondKeys, getAddresses, getBond, zeroAddress } from '../../constants';

import {
  getBondDiscount,
  getBondQuote,
  getMaxUserCanBuy,
  getDebtRatio,
  getPurchasedBonds,
  getTransformedBondPrice,
  getTransformedMarketPrice,
  getTransformedMaxPayout,
} from '../utils';
import { listMyNFT, listLockededNFT } from './nft-action';

interface IChangeApproval {
  bondKey: BondKey;
  provider: JsonRpcProvider;
  networkID: number;
  address: string;
}

export const changeApproval = createAsyncThunk(
  'bonding/changeApproval',
  async ({ bondKey, provider, networkID, address }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = contractForReserve(bondKey, networkID, signer);
    const bond = getBond(bondKey, networkID);
    let allowance = 0;

    let approveTx;
    try {
      const approvedPromise = new Promise<BigNumber>(resolve => {
        const event = reserveContract.filters.Approval(address, bond.address);
        const action = (_owner: string, _spender: string, allowance: BigNumber) => {
          reserveContract.off(event, action);
          resolve(allowance);
        };
        reserveContract.on(event, action);
      });
      approveTx = await reserveContract.approve(bond.address, constants.MaxUint256);
      dispatch(
        fetchPendingTxns({ txnHash: approveTx.hash, text: 'Approving ' + bond.name, type: 'approve_' + bond.key }),
      );

      allowance = +(await approvedPromise);
    } catch (error: any) {
      alert(error.message);
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    const rawBalance = (await reserveContract.balanceOf(address)).toString();
    const balance = ethers.utils.formatEther(rawBalance);

    return dispatch(
      fetchAccountSuccess({
        [bondKey]: {
          allowance,
          balance: +balance,
          rawBalance,
        },
      }),
    );
  },
);

interface CalcBondDetailsPayload {
  bondKey: BondKey;
  value?: string | null;
  provider: JsonRpcProvider;
  networkID: number;
  userBalance: string;
  nftAddress: string;
  tokenId: number;
}

const DEPRECATED_BOND_STATIC_VALUES = {
  bondDiscount: 1,
  debtRatio: 1,
  bondQuote: 1,
  purchased: 1,
  vestingTerm: 1,
  maxPayout: 1,
  bondPrice: 1,
  marketPrice: '0.0',
  maxUserCanBuy: '0.0',
  nftApproved: true,
  lockedNFTs: [],
};

export const calcBondDetails = createAsyncThunk(
  'bonding/calcBondDetails',
  async ({
    bondKey,
    value,
    provider,
    networkID,
    userBalance,
    nftAddress,
    tokenId,
  }: CalcBondDetailsPayload): Promise<BondDetails> => {
    const amountInWei = !value
      ? ethers.utils.parseEther('0.0001') // Use a realistic SLP ownership
      : ethers.utils.parseEther(value);

    const bond = getBond(bondKey, networkID);
    const bondContract = contractForBond(bondKey, networkID, provider);
    const addresses = getAddresses(networkID);
    const nftContract = new ethers.Contract(nftAddress, ERC721, provider);
    let nftApproved = false;
    if (nftAddress != zeroAddress && (await nftContract.getApproved(tokenId)) == bond.address) {
      nftApproved = true;
    }

    if (bond.deprecated) {
      return {
        bond: bondKey,
        ...DEPRECATED_BOND_STATIC_VALUES,
      };
    }

    const discountArgs = bondKey === 'mai_clam44' ? [nftAddress, tokenId] : [];
    // Calculate bond discount
    const bondPriceInUSD = await bondContract.bondPriceInUSD(...discountArgs);

    const maiPrice = await getTokenPrice('MAI');
    const originalMarketPrice = ((await getMarketPrice(networkID, provider)) as BigNumber).mul(maiPrice);
    const bondDiscount = getBondDiscount({ originalMarketPrice, bondPriceInUSD });

    // Calculate bond quote
    const bondCalcContract = new ethers.Contract(addresses.CLAM_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
    const payoutForValuation =
      bond.type === 'lp'
        ? await (async () => {
            const valuation = await bondCalcContract.valuation(bond.reserve, amountInWei);
            return await bondContract.payoutFor(...[valuation, ...discountArgs]);
          })()
        : await bondContract.payoutFor(amountInWei);
    const bondQuote = getBondQuote({ bondType: bond.type, payoutForValuation });

    // Calculate max bond that user can buy
    const maxQuoteOfUser = (await bondContract.payoutFor(...[userBalance, ...discountArgs])).div(1e9) as BigNumber;
    const originalMaxPayout = await bondContract.maxPayout();
    const isOverMaxPayout = maxQuoteOfUser.gte(originalMaxPayout);
    const maxUserCanBuy = getMaxUserCanBuy({ isOverMaxPayout, originalMaxPayout, bondPriceInUSD, userBalance });

    // Calculate debt ratio
    const standardizedDebtRatio = await bondContract.standardizedDebtRatio();
    const debtRatio = getDebtRatio({ bondType: bond.type, standardizedDebtRatio });

    // Calculate bonds purchased
    const reserveContract = contractForReserve(bondKey, networkID, provider);
    const balanceOfTreasury = await reserveContract.balanceOf(addresses.TREASURY_ADDRESS);
    const markdown = bond.type === 'lp' && (await bondCalcContract.markdown(bond.reserve));
    const valuation = bond.type === 'lp' && (await bondCalcContract.valuation(bond.reserve, balanceOfTreasury));
    const priceFeed = bond.oracle && new ethers.Contract(bond.oracle, AggregatorV3InterfaceABI, provider);
    const latestRoundData = priceFeed && (await priceFeed.latestRoundData());
    const purchased = getPurchasedBonds({
      bondType: bond.type,
      isBondStable: bond.stable,
      balanceOfTreasury,
      ...(valuation && { valuation }),
      ...(markdown && { markdown }),
      ...(latestRoundData && { latestRoundDataAnswer: latestRoundData?.answer }),
    });

    // Get transformed prices
    const bondPrice = getTransformedBondPrice({ bondPriceInUSD });
    const marketPrice = getTransformedMarketPrice({ originalMarketPrice });

    // Get vesting term
    const terms = await bondContract.terms();
    const vestingTerm = +terms.vestingTerm;

    // Display error if user tries to exceed maximum.
    const maxPayout = getTransformedMaxPayout({ originalMaxPayout });
    if (!!value && bondQuote > maxPayout) {
      alert(
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
          (originalMaxPayout / 1e9).toFixed(2).toString() +
          ' CLAM.',
      );
    }

    return {
      bond: bondKey,
      bondDiscount,
      debtRatio,
      bondQuote,
      purchased,
      vestingTerm,
      maxPayout,
      bondPrice,
      marketPrice,
      maxUserCanBuy,
      nftApproved,
    };
  },
);

type BatchGetBondDetailsPayload = Omit<CalcBondDetailsPayload, 'bondKey'> & { address?: string };
export const batchGetBondDetails = createAsyncThunk(
  'bonding/batchGetBondDetails',
  async (payload: BatchGetBondDetailsPayload, { dispatch }) => {
    await Promise.all(
      BondKeys.map(async bondKey => {
        await dispatch(calcBondDetails({ bondKey, ...payload }));
        await dispatch(
          listLockededNFT({
            bondKey,
            wallet: payload.address,
            networkID: payload.networkID,
            provider: payload.provider,
          }),
        );
      }),
    );
  },
);

interface IBondAsset {
  value: string;
  address: string;
  bondKey: BondKey;
  networkID: number;
  provider: JsonRpcProvider;
  slippage: number;
  tokenId: number;
  nftAddress: string;
}

export const bondAsset = createAsyncThunk(
  'bonding/bondAsset',
  async ({ value, address, bondKey, networkID, provider, slippage, tokenId, nftAddress }: IBondAsset, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005;
    const valueInWei = ethers.utils.parseEther(value);

    const signer = provider.getSigner();
    const bondContract = contractForBond(bondKey, networkID, signer);

    const discountArgs = bondKey === 'mai_clam44' ? [nftAddress, tokenId] : [];
    const calculatePremium = await bondContract.bondPrice(...discountArgs);
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));
    const bond = getBond(bondKey, networkID);

    let bondTx;
    try {
      bondTx = await bondContract.deposit(...[valueInWei, maxPremium, depositorAddress, ...discountArgs]);
      dispatch(fetchPendingTxns({ txnHash: bondTx.hash, text: 'Bonding ' + bond.name, type: 'bond_' + bondKey }));
      dispatch(listMyNFT({ wallet: address, networkID: networkID, provider }));
      await bondTx.wait();
      return;
    } catch (error: any) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert('You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow');
      } else alert(JSON.stringify(error));
      return;
    } finally {
      if (bondTx) {
        dispatch(clearPendingTxn(bondTx.hash));
        return true;
      }
    }
  },
);

interface IRedeemBond {
  address: string;
  bondKey: BondKey;
  networkID: number;
  provider: JsonRpcProvider;
  autostake: boolean;
}

export const redeemBond = createAsyncThunk(
  'bonding/redeemBond',
  async ({ address, bondKey, networkID, provider, autostake }: IRedeemBond, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const bondContract = contractForBond(bondKey, networkID, signer);
    const bond = getBond(bondKey, networkID);

    let redeemTx;
    try {
      const redeemArgs = [address, ...(bondKey === 'mai_clam44' ? [] : [autostake])];
      redeemTx = await bondContract.redeem(...redeemArgs);
      const pendingTxnType = 'redeem_bond_' + bond.key + (autostake === true ? '_autostake' : '');
      dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: 'Redeeming ' + bond.name, type: pendingTxnType }));
      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bondKey, networkID, provider }));
      await dispatch(listMyNFT({ wallet: address, networkID: networkID, provider }));
      dispatch(getBalances({ address, networkID, provider }));
      return;
    } catch (error: any) {
      alert(error.message);
    } finally {
      if (redeemTx) {
        dispatch(clearPendingTxn(redeemTx.hash));
        return true;
      }
    }
  },
);
