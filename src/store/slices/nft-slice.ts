import { createSlice } from '@reduxjs/toolkit';
import { listMyNFT } from '../actions/nft-action';
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
    builder.addCase(listMyNFT.fulfilled, (state, action) => {
      state.account.nfts = action.payload;
      state.account.nfts.loading = false;
    });
    builder.addCase(listMyNFT.rejected, (state, action) => {
      state.account.nfts.loading = false;
      throw new Error(action.error.message);
    });
    builder.addCase(listMyNFT.pending, state => {
      state.account.nfts.loading = true;
    });
  },
});

export default nftSlice.reducer;
