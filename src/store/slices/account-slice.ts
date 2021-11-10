import { ethers } from 'ethers';
import { BONDS, getAddresses } from '../../constants';
import { ClamTokenContract, StakedClamContract, MAIContract, StakingContract } from '../../abi/';
import { contractForBond, contractForReserve, setAll } from '../../helpers';

import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';

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
        sClam: ethers.utils.formatUnits(sClamBalance, 'gwei'),
        clam: ethers.utils.formatUnits(clamBalance, 'gwei'),
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
        sClam: ethers.utils.formatUnits(sClamBalance, 'gwei'),
        clam: ethers.utils.formatUnits(clamBalance, 'gwei'),
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

interface ICalculateUserBondDetails {
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const calculateUserBondDetails = createAsyncThunk(
  'bonding/calculateUserBondDetails',
  async ({ address, bond, networkID, provider }: ICalculateUserBondDetails): Promise<IUserBindDetails> => {
    if (!address) return {};

    const addresses = getAddresses(networkID);
    const bondContract = contractForBond(bond, networkID, provider);
    const reserveContract = contractForReserve(bond, networkID, provider);

    let interestDue, pendingPayout, bondMaturationTime;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTimestamp;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = '0';

    if (bond === BONDS.mai) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MAI);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    if (bond === BONDS.mai_clam) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MAI_CLAM);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    if (bond === BONDS.mai_clam_v2) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MAI_CLAM_V2);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    return {
      bond,
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
      setAll(state, action.payload);
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
