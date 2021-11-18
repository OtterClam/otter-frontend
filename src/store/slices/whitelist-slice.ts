import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAll } from '../../helpers';

const initialState = {
  loading: true,
};

export interface IWhitelist {
  loading: boolean;
  whitelisted: boolean;
}

interface ICheckIDOWhitelist {
  walletAddress: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const checkIDOWhiteList = createAsyncThunk(
  'whitelist/check-whitelist',
  //@ts-ignore
  async ({ walletAddress, networkID, provider }: ICheckIDOWhitelist) => {
    // const addresses = getAddresses(networkID);
    // const whitelist = new ethers.Contract(addresses.IDO, IDOContract, provider);
    // const whitelisted = await whitelist.whiteListed(walletAddress);
    try {
      const whitelisted = await axios.get(
        'https://us-central1-assetflow-dev.cloudfunctions.net/checkWhiteList?wallet=' + walletAddress,
      );

      return {
        whitelisted,
        loading: false,
      };
    } catch (error) {
      return {
        whitelisted: false,
        loading: false,
      };
    }
  },
);

const whitelistSlice = createSlice({
  name: 'whitelist',
  initialState,
  reducers: {
    fetchIDOSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkIDOWhiteList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(checkIDOWhiteList.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(checkIDOWhiteList.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: { whitelist: IWhitelist }) => state.whitelist;

export default whitelistSlice.reducer;

export const { fetchIDOSuccess } = whitelistSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
