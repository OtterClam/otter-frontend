import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { BigNumber, ethers } from 'ethers';
import _ from 'lodash';
import { ClamTokenContract, MAIContract, PearlTokenContract, StakedClamContract } from 'src/abi';
import { BondKey, getAddresses, getBond } from 'src/constants';
import { contractForBond, contractForReserve, setAll } from 'src/helpers';

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
    pearl: string;
  };
  staking: {
    clamStake: number;
    sClamUnstake: number;
    warmup: string;
    canClaimWarmup: boolean;
  };
  wrapping: {
    sClamWrap: number;
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
    const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);
    const pearlBalance = await pearlContract.balanceOf(address);
    return {
      balances: {
        sClam: ethers.utils.formatUnits(sClamBalance, 9),
        clam: ethers.utils.formatUnits(clamBalance, 9),
        pearl: ethers.utils.formatEther(pearlBalance),
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
    const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);

    const [maiBalance, clamBalance, sClamBalance, pearlBalance, stakeAllowance, unstakeAllowance, wrapAllowance] =
      await Promise.all([
        maiContract.balanceOf(address),
        clamContract.balanceOf(address),
        sClamContract.balanceOf(address),
        pearlContract.balanceOf(address),
        clamContract.allowance(address, addresses.STAKING_HELPER_ADDRESS),
        sClamContract.allowance(address, addresses.STAKING_ADDRESS),
        sClamContract.allowance(address, addresses.PEARL_ADDRESS),
      ]);

    return {
      balances: {
        sClam: ethers.utils.formatUnits(sClamBalance, 9),
        clam: ethers.utils.formatUnits(clamBalance, 9),
        mai: ethers.utils.formatEther(maiBalance),
        pearl: ethers.utils.formatEther(pearlBalance),
      },
      staking: {
        clamStake: +stakeAllowance,
        sClamUnstake: +unstakeAllowance,
        warmup: '0',
        canClaimWarmup: false,
      },
      wrapping: {
        sClamWrap: +wrapAllowance,
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
    wrap(state, action) {
      const { pearl, sClam } = state.balances;
      const newPearlBalance = ethers.utils.formatEther(ethers.utils.parseEther(pearl).add(action.payload.pearl));
      const newsClamBalance = ethers.utils.formatUnits(ethers.utils.parseUnits(sClam, 9).sub(action.payload.sClam), 9);
      _.merge(state, { balances: { pearl: newPearlBalance, sClam: newsClamBalance } });
    },
    unwrap(state, action) {
      const { pearl, sClam } = state.balances;
      const newPearlBalance = ethers.utils.formatEther(ethers.utils.parseEther(pearl).sub(action.payload.pearl));
      const newsClamBalance = ethers.utils.formatUnits(ethers.utils.parseUnits(sClam, 9).add(action.payload.sClam), 9);
      _.merge(state, { balances: { pearl: newPearlBalance, sClam: newsClamBalance } });
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

export const { fetchAccountSuccess, wrap, unwrap } = accountSlice.actions;

const baseInfo = (state: { account: IAccount }) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
