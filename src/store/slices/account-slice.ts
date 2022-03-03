import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ethers, utils } from 'ethers';
import _ from 'lodash';
import { ClamTokenContract, PearlTokenContract, StakedClamContract } from 'src/abi';
import { BondKey, getAddresses, getBond } from 'src/constants';
import { contractForBond, contractForReserve, setAll } from 'src/helpers';
import { listMyNFT } from '../actions/nft-action';
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
  // nftApproved?: boolean;
}

export interface IAccount {
  balances: {
    sClam: string;
    clam: string;
    pearl: string;
  };
  staking: {
    clamStake: number;
    sClamUnstake: number;
    pearlUnstake: number;
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
    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, ClamTokenContract, provider);
    const clamBalance = await clamContract.balanceOf(address);
    const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);
    const sClamBalance = await sClamContract.balanceOf(address);
    const pearlBalance = await pearlContract.balanceOf(address);
    return {
      balances: {
        sClam: utils.formatUnits(sClamBalance, 9),
        clam: utils.formatUnits(clamBalance, 9),
        pearl: utils.formatEther(pearlBalance),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({ networkID, provider, address }: IAccountProps): Promise<IAccount> => {
    const addresses = getAddresses(networkID);
    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, ClamTokenContract, provider);
    const sClamContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, provider);
    const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);

    const [
      clamBalance,
      sClamBalance,
      pearlBalance,
      stakeAllowance,
      unstakeAllowance,
      wrapAllowance,
      pearlUnstakeAllowance,
    ] = await Promise.all([
      clamContract.balanceOf(address),
      sClamContract.balanceOf(address),
      pearlContract.balanceOf(address),
      clamContract.allowance(address, addresses.STAKING_PEARL_HELPER_ADDRESS),
      sClamContract.allowance(address, addresses.STAKING_ADDRESS),
      sClamContract.allowance(address, addresses.PEARL_ADDRESS),
      pearlContract.allowance(address, addresses.STAKING_PEARL_HELPER_ADDRESS),
    ]);

    return {
      balances: {
        sClam: utils.formatUnits(sClamBalance, 9),
        clam: utils.formatUnits(clamBalance, 9),
        pearl: utils.formatEther(pearlBalance),
      },
      staking: {
        clamStake: +stakeAllowance,
        sClamUnstake: +unstakeAllowance,
        pearlUnstake: +pearlUnstakeAllowance,
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
  }: // nftAddress,
  CalculateUserBondDetailsActionPayload): Promise<IUserBondDetails> => {
    if (!address) return {};

    const addresses = getAddresses(networkID);
    const bond = getBond(bondKey, networkID);
    const bondContract = contractForBond(bondKey, networkID, provider);
    // const nftContract = new ethers.Contract(nftAddress, ERC721, provider);
    const reserveContract = contractForReserve(bondKey, networkID, provider);
    const sCLAM = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, provider);

    const bondDetails = await bondContract.bondInfo(address);
    const interestDue =
      (bond.autostake ? await sCLAM.balanceForGons(bondDetails.gonsPayout) : bondDetails.payout) / 1e9;
    const bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTimestamp;
    const pendingPayout = await bondContract.pendingPayoutFor(address);

    const allowance = await reserveContract.allowance(address, bond.address);
    const rawBalance = (await reserveContract.balanceOf(address)).toString();
    const balance = ethers.utils.formatEther(rawBalance);
    // const nftApproved = await nftContract.isApprovedForAll(address, bond.address);

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
      })
      .addCase(listMyNFT.fulfilled, (state, { payload }) => {
        state.nfts = payload;
        state.loading = false;
      })
      .addCase(listMyNFT.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(listMyNFT.pending, state => {
        state.loading = true;
      });
    // .addCase(bondAsset.fulfilled, (state, { payload }) => {
    //   if (!payload) return;
    //   state[payload.bondKey].interestDue = payload.interestDue;
    // });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess, wrap, unwrap } = accountSlice.actions;

const baseInfo = (state: { account: IAccount }) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
