import { ethers } from 'ethers';
import { Bond, BondKey, getAddresses, getBond } from '../../constants';
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

interface IUserBindDetails {
  bond?: string;
  allowance?: number;
  balance?: number;
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
  migration: {
    oldClam: string;
    oldSClam: string;
    oldWarmup: string;
    canClaimWarmup: boolean;
    clamAllowance: number;
    sCLAMAllowance: number;
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

    // migrate
    const oldClamContract = new ethers.Contract(addresses.OLD_CLAM_ADDRESS, ClamTokenContract, provider);
    const oldSClamContract = new ethers.Contract(addresses.OLD_SCLAM_ADDRESS, StakedClamContract, provider);
    const oldStakingContract = new ethers.Contract(addresses.OLD_STAKING_ADDRESS, StakingContract, provider);
    // end

    const [
      maiBalance,
      clamBalance,
      stakeAllowance,
      sClamBalance,
      unstakeAllowance,
      warmup,
      epoch,
      oldClamBalance,
      oldSClamBalance,
      oldWarmup,
      oldSClamAllowance,
      clamMigratorAllowance,
    ] = await Promise.all([
      maiContract.balanceOf(address),
      clamContract.balanceOf(address),
      clamContract.allowance(address, addresses.STAKING_HELPER_ADDRESS),
      sClamContract.balanceOf(address),
      sClamContract.allowance(address, addresses.STAKING_ADDRESS),
      stakingContract.warmupInfo(address),
      stakingContract.epoch(),
      oldClamContract.balanceOf(address),
      oldSClamContract.balanceOf(address),
      oldStakingContract.warmupInfo(address),
      oldSClamContract.allowance(address, addresses.OLD_STAKING_ADDRESS),
      oldClamContract.allowance(address, addresses.MIGRATOR),
    ]);

    const gons = warmup[1];
    const warmupBalance = await sClamContract.balanceForGons(gons);

    const oldGons = oldWarmup[1];
    const oldWarmupBalance = await oldSClamContract.balanceForGons(oldGons);

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
      migration: {
        oldClam: ethers.utils.formatUnits(oldClamBalance, 9),
        oldSClam: ethers.utils.formatUnits(oldSClamBalance, 9),
        oldWarmup: ethers.utils.formatUnits(oldWarmupBalance, 9),
        canClaimWarmup: oldWarmup[0].gt(0) && epoch[1].gte(oldWarmup[2]),
        sCLAMAllowance: +oldSClamAllowance,
        clamAllowance: +clamMigratorAllowance,
      },
    };
  },
);

interface ICalculateUserBondDetails {
  address: string;
  bondKey: BondKey;
  networkID: number;
  provider: JsonRpcProvider;
}

export const calculateUserBondDetails = createAsyncThunk(
  'bonding/calculateUserBondDetails',
  async ({ address, bondKey, networkID, provider }: ICalculateUserBondDetails): Promise<IUserBindDetails> => {
    if (!address) return {};

    const bondContract = contractForBond(bondKey, networkID, provider);
    const reserveContract = contractForReserve(bondKey, networkID, provider);

    let interestDue, pendingPayout, bondMaturationTime;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTimestamp;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    const bond = getBond(bondKey, networkID);
    const allowance = await reserveContract.allowance(address, bond.address);
    const balance = ethers.utils.formatEther(await reserveContract.balanceOf(address));

    return {
      bond: bondKey,
      allowance: Number(allowance),
      balance: Number(balance),
      interestDue,
      bondMaturationTime,
      pendingPayout: Number(ethers.utils.formatUnits(pendingPayout, 'gwei')),
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
