import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { ClamCirculatingSupply, StakedClamContract, StakingContract } from '../../abi';
import { getAddresses } from '../../constants';
import { getMarketPrice, getTokenPrice, setAll } from '../../helpers';

const initialState = {
  loading: true,
};

export interface IApp {
  loading: boolean;
  marketPrice: number;
  circSupply: number;
  currentIndex: string;
  currentBlock: number;
  currentBlockTime: number;
  fiveDayRate: number;
  stakingAPY: number;
  stakingRebase: number;
  networkID: number;
  nextRebase: number;
}

interface ILoadAppDetails {
  networkID: number;
  provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
  'app/loadAppDetails',
  //@ts-ignore
  async ({ networkID, provider }: ILoadAppDetails) => {
    const maiPrice = await getTokenPrice('MAI');

    const addresses = getAddresses(networkID);

    const sCLAMContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, provider);
    const clamCirculatingSupply = new ethers.Contract(
      addresses.CLAM_CIRCULATING_SUPPLY,
      ClamCirculatingSupply,
      provider,
    );
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    const [circSupply, epoch, sClamCirc, currentIndex, rawMarketPrice] = await Promise.all([
      (await clamCirculatingSupply.CLAMCirculatingSupply()) / 1e9,
      stakingContract.epoch(),
      (await sCLAMContract.circulatingSupply()) / 1e9,
      stakingContract.index(),
      getMarketPrice(networkID, provider),
    ]);
    const stakingReward = epoch.distribute / 1e9;
    const stakingRebase = stakingReward / sClamCirc;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    const nextRebase = epoch.endTime.toNumber();

    const marketPrice = Number(((rawMarketPrice.toNumber() / 1e9) * maiPrice).toFixed(2));

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
      circSupply,
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingRebase,
      marketPrice,
      currentBlockTime,
      nextRebase,
    };
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: { app: IApp }) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
