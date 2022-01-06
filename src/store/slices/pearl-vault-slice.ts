import groupBy from 'lodash/groupBy';
import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { BigNumber, constants, ethers } from 'ethers';
import { PearlNote, PearlVaulte, PearlTokenContract } from '../../abi';
import { getAddresses } from '../../constants';
import { setAll } from '../../helpers';
import { fetchPendingTxns, clearPendingTxn } from './pending-txns-slice';

export interface ITerm {
  note: INote;
  noteAddress: string;
  minLockAmount: BigNumber;
  lockPeriod: BigNumber;
  multiplier: number;
  enabled: boolean;
  fallbackTerm?: ITerm;
}

export interface INote {
  name: string;
  symbol: string;
  noteAddress: string;
}

export interface ILock {
  tokenId: string;
  amount: BigNumber;
  endEpoch: BigNumber;
  receiptUrl: string;
  noteAddress: string;
}

export interface IPearlVaultSliceState {
  loading: boolean;
  terms: ITerm[];
  locks: ILock[];
  selectedTerm?: ITerm;
}

const initialState: IPearlVaultSliceState = {
  loading: true,
  terms: [],
  locks: [],
  selectedTerm: undefined,
};

interface ILoadTermsDetails {
  address: string;
  networkID: number;
  provider: JsonRpcProvider;
}

interface IClaimRewardDetails {
  noteAddress: string;
  tokenId: number;
  networkID: number;
  provider: JsonRpcProvider;
}

interface IRedeemDetails {
  noteAddress: string;
  tokenId: number;
  networkID: number;
  provider: JsonRpcProvider;
}

interface ILockDetails {
  noteAddress: string;
  amount: string;
  networkID: number;
  provider: JsonRpcProvider;
  address: string;
}

interface IExtendLockDetails {
  noteAddress: string;
  amount: number;
  networkID: number;
  provider: JsonRpcProvider;
  tokenId: number;
}

export const claimReward = createAsyncThunk(
  'pearlVault/claimReward',
  async ({ networkID, provider, noteAddress, tokenId }: IClaimRewardDetails, { dispatch }) => {
    const addresses = getAddresses(networkID);
    const pearlVaultContract = new ethers.Contract(addresses.PEARL_VAULT, PearlVaulte, provider);
    let tx;

    try {
      tx = pearlVaultContract.claimReward(noteAddress, tokenId);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Claim reward',
          type: 'claim-reward_' + noteAddress + '_' + tokenId,
        }),
      );
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx));
      }
    }
  },
);

export const redeem = createAsyncThunk(
  'pearlVault/redeem',
  async ({ networkID, provider, noteAddress, tokenId }: IRedeemDetails, { dispatch }) => {
    const addresses = getAddresses(networkID);
    const pearlVaultContract = new ethers.Contract(addresses.PEARL_VAULT, PearlVaulte, provider);
    let tx;

    try {
      tx = pearlVaultContract.redeem(noteAddress, tokenId);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Redeem',
          type: 'redeem_' + noteAddress + '_' + tokenId,
        }),
      );
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx));
      }
    }
  },
);

export const lock = createAsyncThunk(
  'pearlVault/lock',
  async ({ networkID, provider, noteAddress, address, amount }: ILockDetails, { dispatch }) => {
    const addresses = getAddresses(networkID);
    const pearlVaultContract = new ethers.Contract(addresses.PEARL_VAULT, PearlVaulte, provider);
    let tx;
    let lockedEvent: any;

    try {
      await allowanceGuard(networkID, provider, address, amount);
      tx = await pearlVaultContract.connect(provider.getSigner()).lock(noteAddress, ethers.utils.parseEther(amount));
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Lock',
          type: 'lock_' + noteAddress,
        }),
      );
      const result = await tx.wait();
      lockedEvent = result.events.find((event: any) => event.event === 'Locked');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }

    if (lockedEvent) {
      return lockedEvent;
    }
  },
);

const allowanceGuard = async (networkID: number, provider: JsonRpcProvider, address: string, amount: string) => {
  const addresses = getAddresses(networkID);
  const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);
  const allowance = await pearlContract.connect(provider.getSigner()).allowance(address, addresses.PEARL_VAULT);
  if (allowance.lt(ethers.utils.parseEther(amount))) {
    await pearlContract.connect(provider.getSigner()).approve(addresses.PEARL_VAULT, constants.MaxUint256);
  }
};

export const extendLock = createAsyncThunk(
  'pearlVault/extendLock',
  async ({ networkID, provider, noteAddress, amount, tokenId }: IExtendLockDetails, { dispatch }) => {
    const addresses = getAddresses(networkID);
    const pearlVaultContract = new ethers.Contract(addresses.PEARL_VAULT, PearlVaulte, provider);
    let tx;

    try {
      tx = pearlVaultContract.extendLock(noteAddress, tokenId, amount);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Extend Lock',
          type: 'extend-lock' + noteAddress + '_' + tokenId,
        }),
      );
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx));
      }
    }
  },
);

export const loadTermsDetails = createAsyncThunk(
  'pearlVault/loadTermsDetails',
  async ({ address, networkID, provider }: ILoadTermsDetails) => {
    const { terms, locks } = await getTermsAndLocks(address, networkID, provider);
    return { terms, locks };
  },
);

async function getTermsAndLocks(address: string, networkID: number, provider: JsonRpcProvider) {
  const addresses = getAddresses(networkID);
  const pearlVaultContract = new ethers.Contract(addresses.PEARL_VAULT, PearlVaulte, provider);

  const termsCount = (await pearlVaultContract.termsCount()).toNumber();
  const actions: Promise<ITerm>[] = [];
  const locks: ILock[] = [];

  for (let i = 0; i < termsCount; i += 1) {
    actions.push(
      (async (i: number) => {
        const termAddress = await pearlVaultContract.termAddresses(i);
        const term = await pearlVaultContract.terms(termAddress);
        const noteContract = new ethers.Contract(term.note, PearlNote, provider);
        const [locksCount, name, symbol] = await Promise.all([
          noteContract.balanceOf(address),
          noteContract.name(),
          noteContract.symbol(),
        ]);
        for (let j = 0; j < locksCount.toNumber(); j += 1) {
          const id = await noteContract.tokenOfOwnerByIndex(address, j);
          const [lock, receiptUrl] = await Promise.all([noteContract.lockInfos(id), noteContract.tokenURI(id)]);
          locks.push({
            ...lock,
            receiptUrl,
            noteAddress: term.note,
            tokenId: id.toString(),
          });
        }
        return {
          ...term,
          noteAddress: term.note,
          note: {
            name,
            symbol,
          },
        };
      })(i),
    );
  }

  const rawTerms = await Promise.all(actions);
  const grouppedTerms = groupBy(rawTerms, term => term.lockPeriod.toNumber());

  const terms = Object.keys(grouppedTerms).map(key => {
    const term = grouppedTerms[key].find(term => term.minLockAmount.gt(0)) || grouppedTerms[key][0];
    const fallbackTerm = grouppedTerms[key].find(term => term.minLockAmount.eq(0));
    return {
      ...term,
      fallbackTerm: fallbackTerm?.noteAddress === term.noteAddress ? undefined : fallbackTerm,
    };
  });

  return { terms, locks };
}

const pearlVaultSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    selectTerm(state, action) {
      state.selectedTerm = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadTermsDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadTermsDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadTermsDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: { app: IPearlVaultSliceState }) => state.app;

export default pearlVaultSlice.reducer;

export const { selectTerm } = pearlVaultSlice.actions;

export const getPearlVaultState = createSelector(baseInfo, pearlVault => pearlVault);
