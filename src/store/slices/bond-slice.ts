import { ethers, constants, BigNumber } from 'ethers';
import { getMarketPrice, contractForBond, contractForReserve, getTokenPrice } from '../../helpers';
import { calculateUserBondDetails, getBalances } from './account-slice';
import { BondKey, getAddresses, getBond } from '../../constants';
import { BondingCalcContract, AggregatorV3InterfaceABI } from '../../abi';
import { fetchPendingTxns, clearPendingTxn } from './pending-txns-slice';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';
import { fetchAccountSuccess } from './account-slice';
import { formatUnits } from '@ethersproject/units';

interface IState {
  [key: string]: any;
}

const initialState: IState = {
  loading: true,
};

interface IChangeApproval {
  bondKey: BondKey;
  provider: JsonRpcProvider;
  networkID: number;
  address: string;
}

export interface BondDetails {
  bond: BondKey;
  bondDiscount: number;
  debtRatio: number;
  bondQuote: number;
  purchased: number;
  vestingTerm: number;
  maxPayout: number;
  bondPrice: number;
  marketPrice: string;
  maxUserCanBuy: string;
}

export type IBond = {
  [key in BondKey]: BondDetails;
} & { loading: boolean };

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
        const action = (owner: string, spender: string, allowance: BigNumber) => {
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
}

export const calcBondDetails = createAsyncThunk(
  'bonding/calcBondDetails',
  async ({ bondKey, value, provider, networkID, userBalance }: CalcBondDetailsPayload): Promise<BondDetails> => {
    const amountInWei =
      !value || value === ''
        ? ethers.utils.parseEther('0.0001') // Use a realistic SLP ownership
        : ethers.utils.parseEther(value);

    const addresses = getAddresses(networkID);
    const bondContract = contractForBond(bondKey, networkID, provider);
    const bond = getBond(bondKey, networkID);

    // skip loading if bond is deprecated
    if (bond.deprecated) {
      return {
        bond: bondKey,
        bondDiscount: 1,
        debtRatio: 1,
        bondQuote: 1,
        purchased: 1,
        vestingTerm: 1,
        maxPayout: 1,
        bondPrice: 1,
        marketPrice: '0.0',
        maxUserCanBuy: '0.0',
      };
    }

    let bondPrice = 0,
      bondDiscount = 0,
      valuation,
      bondQuote,
      maxUserCanBuy = userBalance;

    const bondCalcContract = new ethers.Contract(addresses.CLAM_BONDING_CALC_ADDRESS, BondingCalcContract, provider);

    const terms = await bondContract.terms();
    const maxPayout = await bondContract.maxPayout();
    const standardizedDebtRatio = await bondContract.standardizedDebtRatio();

    let debtRatio = standardizedDebtRatio / 1e9;
    const maiPrice = await getTokenPrice('MAI');
    const rawMarketPrice = (await getMarketPrice(networkID, provider)).mul(maiPrice);
    const marketPrice = formatUnits(rawMarketPrice, 9);

    try {
      bondPrice = await bondContract.bondPriceInUSD();
      bondDiscount = (rawMarketPrice.toNumber() * 1e9 - bondPrice) / bondPrice;
    } catch (e) {
      console.log('error getting bondPriceInUSD', e);
    }

    if (bond.type === 'lp') {
      valuation = await bondCalcContract.valuation(bond.reserve, amountInWei);
      bondQuote = await bondContract.payoutFor(valuation);
      bondQuote = bondQuote / 1e9;

      // let maxQuoteOfUser = await bondContract.payoutFor(await bondCalcContract.valuation(bond.reserve, userBalance));
      // if (maxQuoteOfUser.gte(maxPayout)) {
      //   maxQuoteOfUser = maxPayout.sub(1);
      //   const rawBondPrice = await bondContract.bondPrice();
      //   maxUserCanBuy = maxQuoteOfUser.mul(rawBondPrice).toString();
      // } else {
      //   maxUserCanBuy = userBalance;
      // }
    } else {
      bondQuote = await bondContract.payoutFor(amountInWei);
      bondQuote = bondQuote / 1e18;
      // @dev: fix for non-lp bond
      debtRatio = standardizedDebtRatio.toNumber();

      let maxQuoteOfUser = (await bondContract.payoutFor(userBalance)).div(1e9);
      if (maxQuoteOfUser.gte(maxPayout)) {
        maxUserCanBuy = maxPayout.sub(1).mul(bondPrice).div(1e9).toString();
      }
    }

    // Display error if user tries to exceed maximum.
    if (!!value && bondQuote > maxPayout / 1e9) {
      alert(
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
          (maxPayout / 1e9).toFixed(2).toString() +
          ' CLAM.',
      );
    }

    // Calculate bonds purchased
    const token = contractForReserve(bondKey, networkID, provider);
    let purchased = await token.balanceOf(addresses.TREASURY_ADDRESS);

    if (bond.type === 'lp') {
      const markdown = await bondCalcContract.markdown(bond.reserve);
      purchased = await bondCalcContract.valuation(bond.reserve, purchased);
      purchased = (markdown / 1e18) * (purchased / 1e9);
    } else if (bond.stable) {
      purchased = purchased / 1e18;
    } else {
      const priceFeed = new ethers.Contract(bond.oracle!, AggregatorV3InterfaceABI, provider);
      const latestRoundData = await priceFeed.latestRoundData();
      purchased = (purchased / 1e18) * (latestRoundData.answer / 1e8);
    }

    return {
      bond: bondKey,
      bondDiscount,
      debtRatio,
      bondQuote,
      purchased,
      vestingTerm: Number(terms.vestingTerm),
      maxPayout: maxPayout / 1e9,
      bondPrice: bondPrice / 1e18,
      marketPrice,
      maxUserCanBuy,
    };
  },
);

interface IBondAsset {
  value: string;
  address: string;
  bondKey: BondKey;
  networkID: number;
  provider: JsonRpcProvider;
  slippage: number;
}

export const bondAsset = createAsyncThunk(
  'bonding/bondAsset',
  async ({ value, address, bondKey, networkID, provider, slippage }: IBondAsset, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005;
    const valueInWei = ethers.utils.parseEther(value);

    const signer = provider.getSigner();
    const bondContract = contractForBond(bondKey, networkID, signer);

    const calculatePremium = await bondContract.bondPrice();
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));
    const bond = getBond(bondKey, networkID);

    let bondTx;
    try {
      bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      dispatch(fetchPendingTxns({ txnHash: bondTx.hash, text: 'Bonding ' + bond.name, type: 'bond_' + bondKey }));
      await bondTx.wait();
      dispatch(calculateUserBondDetails({ address, bondKey, networkID, provider }));
      return;
    } catch (error: any) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert('You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow');
      } else alert(error.message);
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
      redeemTx = await bondContract.redeem(address, autostake === true);
      const pendingTxnType = 'redeem_bond_' + bond.key + (autostake === true ? '_autostake' : '');
      dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: 'Redeeming ' + bond.name, type: pendingTxnType }));
      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bondKey, networkID, provider }));
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

const bondingSlice = createSlice({
  name: 'bonding',
  initialState,
  reducers: {
    fetchBondSuccess(state, action) {
      state[action.payload.bond] = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(calcBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        state[action.payload.bond] = action.payload;
        state.loading = false;
      })
      .addCase(calcBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = (state: { bonding: IBond }) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
