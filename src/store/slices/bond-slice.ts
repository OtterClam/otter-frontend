import { createSlice, createSelector } from '@reduxjs/toolkit';
import { calcBondDetails, batchGetBondDetails, approveNFT, bondAsset } from '../actions/bond-action';
import { BondKey } from '../../constants';

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
  nftApproved: boolean;
}

export type IBond = {
  [key in BondKey]: BondDetails;
} & { loading: boolean };

interface IState {
  [key: string]: any;
}
const initialState: IState = {
  loading: true,
};

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
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        state[action.payload.bond] = action.payload;
      })
      .addCase(calcBondDetails.rejected, (_state, { error, ...payload }) => {
        console.log(payload, error);
      })
      .addCase(batchGetBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(batchGetBondDetails.fulfilled, state => {
        state.loading = false;
      })
      .addCase(batchGetBondDetails.rejected, (state, { error, ...payload }) => {
        state.loading = false;
        console.log(payload, error);
      })
      .addCase(approveNFT.fulfilled, (state, action) => {
        state[action.payload].nftApproved = true;
      })
      .addCase(approveNFT.rejected, (_state, { error, ...payload }) => {
        console.log(payload, error);
      });
  },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = (state: { bonding: IBond }) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
