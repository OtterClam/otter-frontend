import { BigNumber, ethers } from 'ethers';
import { getAddresses, BONDS } from '../../constants';
import {
  StakingContract,
  StakedClamContract,
  BondingCalcContract,
  ClamCirculatingSupply,
  ClamTokenContract,
} from '../../abi';
import { addressForAsset, contractForReserve, setAll } from '../../helpers';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getMarketPrice, getTokenPrice } from '../../helpers';

const initialState = {
  loading: true,
};

export interface IApp {
  loading: boolean;
  stakingTVL: number;
  marketPrice: number;
  marketCap: number;
  totalSupply: number;
  circSupply: number;
  currentIndex: string;
  currentBlock: number;
  currentBlockTime: number;
  fiveDayRate: number;
  treasuryBalance: number;
  stakingAPY: number;
  stakingRebase: number;
  networkID: number;
  nextRebase: number;
  stakingRatio: number;
  backingPerClam: number;
  treasuryRunway: number;
  pol: number;
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
    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, ClamTokenContract, provider);
    const sCLAMContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, provider);
    const bondCalculator = new ethers.Contract(addresses.CLAM_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
    const clamCirculatingSupply = new ethers.Contract(
      addresses.CLAM_CIRCULATING_SUPPLY,
      ClamCirculatingSupply,
      provider,
    );
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

    let token = contractForReserve(BONDS.mai, networkID, provider);
    const maiAmount = (await token.balanceOf(addresses.TREASURY_ADDRESS)) / 1e18;

    token = contractForReserve(BONDS.mai_clam, networkID, provider);
    const maiClamAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);
    const valuation = await bondCalculator.valuation(addressForAsset(BONDS.mai_clam, networkID), maiClamAmount);
    const markdown = await bondCalculator.markdown(addressForAsset(BONDS.mai_clam, networkID));
    const maiClamUSD = (valuation / 1e9) * (markdown / 1e18);
    const [rfvLPValue, pol] = await getDiscountedPairUSD(maiClamAmount, networkID, provider);

    const treasuryBalance = maiAmount + maiClamUSD;
    const treasuryRiskFreeValue = maiAmount + rfvLPValue;

    const stakingBalance = await stakingContract.contractBalance();
    const circSupply = (await clamCirculatingSupply.CLAMCirculatingSupply()) / 1e9;
    const totalSupply = (await clamContract.totalSupply()) / 1e9;
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute / 1e9;
    const sClamCirc = (await sCLAMContract.circulatingSupply()) / 1e9;
    const stakingRebase = stakingReward / sClamCirc;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    const stakingRatio = sClamCirc / circSupply;
    const backingPerClam = treasuryRiskFreeValue / circSupply;

    const currentIndex = await stakingContract.index();
    const nextRebase = epoch.endTime.toNumber();

    const rawMarketPrice = await getMarketPrice(networkID, provider);
    const marketPrice = Number(((rawMarketPrice.toNumber() / 1e9) * maiPrice).toFixed(2));
    const stakingTVL = (stakingBalance * marketPrice) / 1e9;
    const marketCap = circSupply * marketPrice;

    const treasuryRunway = Math.log(treasuryRiskFreeValue / sClamCirc) / Math.log(1 + stakingRebase) / 3;

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
      totalSupply,
      circSupply,
      marketCap,
      currentBlock,
      fiveDayRate,
      treasuryBalance,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketPrice,
      currentBlockTime,
      nextRebase,
      stakingRatio,
      backingPerClam,
      treasuryRunway,
      pol,
    };
  },
);

//(slp_treasury/slp_supply)*(2*sqrt(lp_dai * lp_clam))
async function getDiscountedPairUSD(
  lpAmount: BigNumber,
  networkID: number,
  provider: JsonRpcProvider,
): Promise<[number, number]> {
  const pair = contractForReserve(BONDS.mai_clam, networkID, provider);
  const total_lp = await pair.totalSupply();
  const reserves = await pair.getReserves();
  // const lp_token_1 = reserves[0] / 1e9;
  const lp_token_2 = reserves[1] / 1e18;
  // const kLast = lp_token_1 * lp_token_2;

  const pol = lpAmount.mul(100).div(total_lp).toNumber() / 100;
  // const part2 = Math.sqrt(kLast) * 2;
  return [pol * lp_token_2, pol];
}

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
