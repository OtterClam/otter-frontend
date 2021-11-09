import { ethers, constants } from 'ethers';
import {
  isBondLP,
  getMarketPrice,
  contractForBond,
  contractForReserve,
  addressForAsset,
  bondName,
  getTokenPrice,
} from '../../helpers';
import { calculateUserBondDetails, getBalances } from './account-slice';
import { getAddresses, BONDS } from '../../constants';
import { BondingCalcContract } from '../../abi';
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
  bond: string;
  provider: JsonRpcProvider;
  networkID: number;
  address: string;
}

export interface IBond {
  [key: string]: any;
}

export const changeApproval = createAsyncThunk(
  'bonding/changeApproval',
  async ({ bond, provider, networkID, address }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = contractForReserve(bond, networkID, signer);
    const addresses = getAddresses(networkID);

    let approveTx;
    try {
      if (bond === BONDS.mai) {
        approveTx = await reserveContract.approve(addresses.BONDS.MAI, constants.MaxUint256);
      }
      if (bond === BONDS.mai_clam) {
        approveTx = await reserveContract.approve(addresses.BONDS.MAI_CLAM, constants.MaxUint256);
      }
      if (bond === BONDS.mai_clam_v2) {
        approveTx = await reserveContract.approve(addresses.BONDS.MAI_CLAM_V2, constants.MaxUint256);
      }
      dispatch(
        fetchPendingTxns({ txnHash: approveTx.hash, text: 'Approving ' + bondName(bond), type: 'approve_' + bond }),
      );
      await approveTx.wait();
    } catch (error) {
      alert(error.message);
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    let allowance,
      balance = '0';

    if (bond === BONDS.mai) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MAI);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    if (bond === BONDS.mai_clam) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MAI_CLAM);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, 'ether');
    }

    if (bond === BONDS.mai_clam_v2) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MAI_CLAM_V2);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, 'ether');
    }

    return dispatch(
      fetchAccountSuccess({
        [bond]: {
          allowance: Number(allowance),
          balance: Number(balance),
        },
      }),
    );
  },
);

interface ICalcBondDetails {
  bond: string;
  value?: string | null;
  provider: JsonRpcProvider;
  networkID: number;
}

export const calcBondDetails = createAsyncThunk(
  'bonding/calcBondDetails',
  async ({ bond, value, provider, networkID }: ICalcBondDetails) => {
    let amountInWei;
    if (!value || value === '') {
      amountInWei = ethers.utils.parseEther('0.0001'); // Use a realistic SLP ownership
    } else {
      amountInWei = ethers.utils.parseEther(value);
    }

    let bondPrice, bondDiscount, valuation, bondQuote;

    const addresses = getAddresses(networkID);

    const bondContract = contractForBond(bond, networkID, provider);

    const bondCalcContract = new ethers.Contract(addresses.CLAM_BONDING_CALC_ADDRESS, BondingCalcContract, provider);

    const terms = await bondContract.terms();

    const maxBondPrice = await bondContract.maxPayout();

    const standardizedDebtRatio = await bondContract.standardizedDebtRatio();
    let debtRatio = standardizedDebtRatio / Math.pow(10, 9);

    const maiPrice = await getTokenPrice('MAI');
    const rawMarketPrice = (await getMarketPrice(networkID, provider)).mul(maiPrice);
    const marketPrice = formatUnits(rawMarketPrice, 9);

    try {
      bondPrice = await bondContract.bondPriceInUSD();
      bondDiscount = (rawMarketPrice.toNumber() * Math.pow(10, 9) - bondPrice) / bondPrice;
    } catch (e) {
      console.log('error getting bondPriceInUSD', e);
    }

    if (bond === BONDS.mai_clam || bond === BONDS.mai_clam_v2) {
      valuation = await bondCalcContract.valuation(addresses.RESERVES.MAI_CLAM, amountInWei);
      bondQuote = await bondContract.payoutFor(valuation);
      bondQuote = bondQuote / Math.pow(10, 9);
    } else {
      bondQuote = await bondContract.payoutFor(amountInWei);
      bondQuote = bondQuote / Math.pow(10, 18);
      // @dev: fix for non-lp bond
      debtRatio = standardizedDebtRatio.toNumber();
    }

    // Display error if user tries to exceed maximum.
    if (!!value && bondQuote > maxBondPrice / 1e9) {
      alert(
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
          (maxBondPrice / 1e9).toFixed(2).toString() +
          ' CLAM.',
      );
    }

    // Calculate bonds purchased
    const token = contractForReserve(bond, networkID, provider);
    let purchased = await token.balanceOf(addresses.TREASURY_ADDRESS);

    if (isBondLP(bond)) {
      const markdown = await bondCalcContract.markdown(addressForAsset(bond, networkID));
      purchased = await bondCalcContract.valuation(addressForAsset(bond, networkID), purchased);
      purchased = (markdown / Math.pow(10, 18)) * (purchased / Math.pow(10, 9));
    } else {
      purchased = purchased / Math.pow(10, 18);
    }

    return {
      bond,
      bondDiscount,
      debtRatio,
      bondQuote,
      purchased,
      vestingTerm: Number(terms.vestingTerm),
      maxBondPrice: maxBondPrice / Math.pow(10, 9),
      bondPrice: bondPrice / Math.pow(10, 18),
      marketPrice,
    };
  },
);

interface IBondAsset {
  value: string;
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
  slippage: number;
}
export const bondAsset = createAsyncThunk(
  'bonding/bondAsset',
  async ({ value, address, bond, networkID, provider, slippage }: IBondAsset, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005;
    const valueInWei = ethers.utils.parseUnits(value.toString(), 'ether');

    const signer = provider.getSigner();
    const bondContract = contractForBond(bond, networkID, signer);

    const calculatePremium = await bondContract.bondPrice();
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    let bondTx;
    try {
      bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      dispatch(fetchPendingTxns({ txnHash: bondTx.hash, text: 'Bonding ' + bondName(bond), type: 'bond_' + bond }));
      await bondTx.wait();
      dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
      return;
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert('You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow');
      } else alert(error.message);
      return;
    } finally {
      if (bondTx) {
        dispatch(clearPendingTxn(bondTx.hash));
      }
    }
  },
);

interface IRedeemBond {
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
  autostake: boolean;
}

export const redeemBond = createAsyncThunk(
  'bonding/redeemBond',
  async ({ address, bond, networkID, provider, autostake }: IRedeemBond, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }

    const signer = provider.getSigner();
    const bondContract = contractForBond(bond, networkID, signer);

    let redeemTx;
    try {
      redeemTx = await bondContract.redeem(address, autostake === true);
      const pendingTxnType = 'redeem_bond_' + bond + (autostake === true ? '_autostake' : '');
      dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: 'Redeeming ' + bondName(bond), type: pendingTxnType }));
      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
      dispatch(getBalances({ address, networkID, provider }));
      return;
    } catch (error) {
      alert(error.message);
    } finally {
      if (redeemTx) {
        dispatch(clearPendingTxn(redeemTx.hash));
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
