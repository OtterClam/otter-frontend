import { createSlice, createSelector } from '@reduxjs/toolkit';
import { calcBondDetails } from '../actions/bond-action';
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
      .addCase(calcBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        state[action.payload.bond] = action.payload;
        state.loading = false;
      })
      .addCase(calcBondDetails.rejected, (state, { error, ...payload }) => {
        state.loading = false;
        console.log(payload, error);
      });
  },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = (state: { bonding: IBond }) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
