import { createSlice } from '@reduxjs/toolkit';
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
  extraReducers: () => {},
});

export default nftSlice.reducer;
