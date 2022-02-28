import { createSlice } from '@reduxjs/toolkit';
import { listBondNFTDiscounts } from '../actions/nft-action';
interface IState {
  [key: string]: any;
}
const initialState: IState = {
  loading: true,
};

const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {},
  extraReducers: builder => {
    /** NOTE: listBondNFTDiscounts vs. batchListBondNFTDiscounts
     * Use list thunk to store bonds' discount values rather than batch list thunk.
     * The reason is that some bonds don't support nft discounts now.
     * In the batch list case, if we fetch a bond without nft discounts, redux will trigger the rejected event and store nothing.
     * However, using list thunk to store will store bonds with discounts, and ignore those without.
     *  */
    builder.addCase(listBondNFTDiscounts.fulfilled, (state, { payload }) => {
      if (!state.bondNftDiscounts.indexes.includes(payload.bondKey)) {
        state.bondNftDiscounts.indexes = state.bondNftDiscounts.indexes.concat([payload.bondKey]);
        state.bondNftDiscounts.data[payload.bondKey] = payload.discounts;
      }
      state.bondNftDiscounts.loading = false;
    });
    builder.addCase(listBondNFTDiscounts.pending, state => {
      const data = { data: {}, indexes: [], loading: true };
      state['bondNftDiscounts'] = data;
    });
  },
});

export default nftSlice.reducer;
