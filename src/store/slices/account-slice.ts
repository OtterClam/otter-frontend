import { ethers } from 'ethers';
import { BondKey, getAddresses, getBond } from '../../constants';
import { ClamTokenContract, StakedClamContract, MAIContract, StakingContract } from '../../abi/';
import { contractForBond, contractForReserve, setAll } from '../../helpers';

import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';
import _ from 'lodash';

interface IState {
  [key: string]: any;
}

const initialState: IState = {
  loading: true,
};

interface IAccountProps {
  address: string;
  networkID: number;
  provider: JsonRpcProvider;
}

interface IUserBondDetails {
  bond?: string;
  allowance?: number;
  balance?: number;
  rawBalance?: string;
  interestDue?: number;
  bondMaturationTime?: number;
  pendingPayout?: number;
}

export interface IAccount {
  balances: {
    mai: string;
    sClam: string;
    clam: string;
  };
  staking: {
    clamStake: number;
    sClamUnstake: number;
    warmup: string;
    canClaimWarmup: boolean;
  };
}

export const getBalances = createAsyncThunk(
  'account/getBalances',
  async ({ address, networkID, provider }: IAccountProps) => {
    const addresses = getAddresses(networkID);
    const sClamContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, provider);
    const sClamBalance = await sClamContract.balanceOf(address);
    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, ClamTokenContract, provider);
    const clamBalance = await clamContract.balanceOf(address);
    return {
      balances: {
        sClam: ethers.utils.formatUnits(sClamBalance, 9),
        clam: ethers.utils.formatUnits(clamBalance, 9),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({ networkID, provider, address }: IAccountProps): Promise<IAccount> => {
    const addresses = getAddresses(networkID);

    const maiContract = new ethers.Contract(addresses.MAI_ADDRESS, MAIContract, provider);
    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, ClamTokenContract, provider);
    const sClamContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, provider);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

    const [maiBalance, clamBalance, stakeAllowance, sClamBalance, unstakeAllowance, warmup, epoch] = await Promise.all([
      maiContract.balanceOf(address),
      clamContract.balanceOf(address),
      clamContract.allowance(address, addresses.STAKING_HELPER_ADDRESS),
      sClamContract.balanceOf(address),
      sClamContract.allowance(address, addresses.STAKING_ADDRESS),
      stakingContract.warmupInfo(address),
      stakingContract.epoch(),
    ]);

    const gons = warmup[1];
    const warmupBalance = await sClamContract.balanceForGons(gons);

    return {
      balances: {
        sClam: ethers.utils.formatUnits(sClamBalance, 9),
        clam: ethers.utils.formatUnits(clamBalance, 9),
        mai: ethers.utils.formatEther(maiBalance),
      },
      staking: {
        clamStake: +stakeAllowance,
        sClamUnstake: +unstakeAllowance,
        warmup: ethers.utils.formatUnits(warmupBalance, 9),
        canClaimWarmup: warmup[0].gt(0) && epoch[1].gte(warmup[2]),
      },
    };
  },
);

interface CalculateUserBondDetailsActionPayload {
  address: string;
  bondKey: BondKey;
  networkID: number;
  provider: JsonRpcProvider;
}

export const calculateUserBondDetails = createAsyncThunk(
  'bonding/calculateUserBondDetails',
  async ({
    address,
    bondKey,
    networkID,
    provider,
  }: CalculateUserBondDetailsActionPayload): Promise<IUserBondDetails> => {
    if (!address) return {};

    const addresses = getAddresses(networkID);
    const bond = getBond(bondKey, networkID);
    const bondContract = contractForBond(bondKey, networkID, provider);
    const reserveContract = contractForReserve(bondKey, networkID, provider);
    const sCLAM = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, provider);

    let interestDue, pendingPayout, bondMaturationTime;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = (bond.autostake ? await sCLAM.balanceForGons(bondDetails.gonsPayout) : bondDetails.payout) / 1e9;
    bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTimestamp;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    const allowance = await reserveContract.allowance(address, bond.address);
    const rawBalance = (await reserveContract.balanceOf(address)).toString();
    const balance = ethers.utils.formatEther(rawBalance);

    return {
      bond: bondKey,
      allowance: Number(allowance),
      balance: Number(balance),
      rawBalance,
      interestDue,
      bondMaturationTime,
      pendingPayout: Number(ethers.utils.formatUnits(pendingPayout, 9)),
    };
  },
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      _.merge(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.status = 'idle';
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.status = 'loading';
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.status = 'idle';
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        //@ts-ignore
        const bond = action.payload.bond!;
        state[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: { account: IAccount }) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
