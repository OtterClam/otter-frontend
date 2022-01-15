import { createSlice } from '@reduxjs/toolkit';
import { listMyNFT, listBondNFTDiscounts } from '../actions/nft-action';
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
    // listMyNFT action will store owner's nfts into account
    builder.addCase(listMyNFT.fulfilled, (state, action) => {
      state.account.nfts.data = action.payload;
      state.account.nfts.loading = false;
    });
    builder.addCase(listMyNFT.rejected, (state, action) => {
      state.account.nfts.loading = false;
      throw new Error(action.error.message);
    });
    builder.addCase(listMyNFT.pending, state => {
      state.account.nfts.loading = true;
    });

    builder.addCase(listBondNFTDiscounts.fulfilled, (state, action) => {
      if (!state.bondNftDiscounts.indexes.includes(action.payload.bondKey)) {
        state.bondNftDiscounts.indexes = state.bondNftDiscounts.indexes.concat([action.payload.bondKey]);
        state.bondNftDiscounts.data = state.bondNftDiscounts.data.concat(action.payload);
      }
      state.bondNftDiscounts.loading = false;
    });
    builder.addCase(listBondNFTDiscounts.pending, state => {
      const data = { data: [], indexes: [], loading: true };
      state['bondNftDiscounts'] = data;
    });
  },
});

export default nftSlice.reducer;
