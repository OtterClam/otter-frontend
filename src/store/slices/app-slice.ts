import { JsonRpcProvider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { ClamCirculatingSupply, ClamTokenContract, StakedClamContract, StakingContract } from '../../abi';
import { getAddresses } from '../../constants';
import { getMarketPrice, getTokenPrice, setAll } from '../../helpers';

const initialState = {
  loading: true,
  marketPrice: 0,
  pearlPrice: 0,
  marketCap: 0,
  circSupply: 0,
  totalSupply: 0,
  stakingRatio: 0,
  currentIndex: '',
  currentBlock: 0,
  currentBlockTime: 0,
  fiveDayRate: 0,
  stakingAPY: 0,
  stakingTVL: 0,
  stakingRebase: 0,
  networkID: 0,
  nextRebase: 0,
  currentEpoch: 0,
};

export interface IApp {
  loading: boolean;
  marketPrice: number;
  pearlPrice: number;
  marketCap: number;
  circSupply: number;
  totalSupply: number;
  stakingRatio: number;
  currentIndex: string;
  currentBlock: number;
  currentBlockTime: number;
  fiveDayRate: number;
  stakingAPY: number;
  stakingTVL: number;
  stakingRebase: number;
  networkID: number;
  nextRebase: number;
  currentEpoch: number;
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

    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, ClamTokenContract, provider);
    const sCLAMContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, provider);
    const clamCirculatingSupply = new ethers.Contract(
      addresses.CLAM_CIRCULATING_SUPPLY,
      ClamCirculatingSupply,
      provider,
    );
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    const [circSupply, totalSupply, epoch, sClamCirc, currentIndex, rawMarketPrice] = await Promise.all([
      (await clamCirculatingSupply.CLAMCirculatingSupply()) / 1e9,
      (await clamContract.totalSupply()) / 1e9,
      stakingContract.epoch(),
      (await sCLAMContract.circulatingSupply()) / 1e9,
      formatUnits(await stakingContract.index(), 9),
      getMarketPrice(networkID, provider),
    ]);
    const stakingReward = epoch.distribute / 1e9;
    const stakingRebase = stakingReward / sClamCirc;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    const nextRebase = epoch.endTime.toNumber();

    const marketPrice = Number(((rawMarketPrice.toNumber() / 1e9) * maiPrice).toFixed(2));
    const stakingTVL = sClamCirc * marketPrice;
    const marketCap = circSupply * marketPrice;
    const stakingRatio = sClamCirc / circSupply;
    const pearlPrice = (marketPrice * Number(currentIndex)).toFixed(2);

    return {
      currentIndex,
      circSupply,
      totalSupply,
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingRebase,
      stakingRatio,
      marketPrice,
      pearlPrice,
      marketCap,
      currentBlockTime,
      nextRebase,
      stakingTVL,
      currentEpoch: epoch.number.toNumber(),
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
