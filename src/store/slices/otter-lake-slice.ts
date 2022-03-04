import { JsonRpcProvider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { createAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { constants, ethers } from 'ethers';
import groupBy from 'lodash/groupBy';
import { OtterLake, PearlNote, PearlTokenContract } from '../../abi';
import { getAddresses } from '../../constants';
import { setAll } from '../../helpers';
import SnackbarUtils from '../../store/snackbarUtils';
import { ThunkOptions } from '../types';
import { clearPendingTxn, fetchPendingTxns } from './pending-txns-slice';

export interface ITerm {
  note: INote;
  noteAddress: string;
  minLockAmount: string;
  lockPeriod: number;
  multiplier: number;
  enabled: boolean;
  pearlBalance: number;
  boostPoint: number;
  apy: number;
  rewardRate: number;
  fallbackTerm?: ITerm;
}

export interface INote {
  name: string;
  symbol: string;
  noteAddress: string;
}

export interface ILockNote {
  name: string;
  tokenId: string;
  amount: number;
  endEpoch: number;
  imageUrl: string;
  noteAddress: string;
  reward: number;
  nextReward: number;
  rewardRate: number;
}

export interface IOtterLakeSliceState {
  loading: boolean;
  loadingNotes: boolean;
  terms: ITerm[];
  lockNotes: ILockNote[];
  selectedTerm?: ITerm;
  allowance: string;
}

const initialState: IOtterLakeSliceState = {
  loading: true,
  loadingNotes: true,
  terms: [],
  lockNotes: [],
  selectedTerm: undefined,
  allowance: '0',
};

interface ILoadTermsDetails {
  chainID: number;
  provider: JsonRpcProvider;
}

interface IApproveSpendingPayload {
  chainID: number;
  provider: JsonRpcProvider;
}

interface IClaimRewardDetails {
  noteAddress: string;
  tokenId: string;
  chainID: number;
  address: string;
  provider: JsonRpcProvider;
}

interface IRedeemDetails {
  noteAddress: string;
  address: string;
  tokenId: string;
  chainID: number;
  provider: JsonRpcProvider;
}

interface IExtendLockDetails {
  noteAddress: string;
  amount: string;
  chainID: number;
  provider: JsonRpcProvider;
  tokenId: string;
  address: string;
}

export const loadTermsDetails = createAsyncThunk(
  'otterLake/loadTermsDetails',
  async ({ chainID, provider }: ILoadTermsDetails, { getState }) => {
    const stakingRebase = (getState() as any).app.stakingRebase;
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);

    const termsCount = (await otterLakeContract.termsCount()).toNumber();
    const epoch = await otterLakeContract.epochs(await otterLakeContract.epoch());
    const totalNextReward = Number(formatEther(epoch.reward));
    const actions: Promise<ITerm>[] = [];
    let totalBoostPoint = 0;

    for (let i = 0; i < termsCount; i += 1) {
      actions.push(
        (async (i: number) => {
          const termAddress = await otterLakeContract.termAddresses(i);
          const term = await otterLakeContract.terms(termAddress);
          const noteContract = new ethers.Contract(term.note, PearlNote, provider);
          const [name, symbol, pearlBalance] = await Promise.all([
            noteContract.name(),
            noteContract.symbol(),
            Number(formatEther(await pearlContract.balanceOf(term.note))),
          ]);
          const boostPoint = (pearlBalance * term.multiplier) / 100;
          totalBoostPoint += boostPoint;
          return {
            noteAddress: term.note,
            lockPeriod: term.lockPeriod.toNumber() / 3, // epochs -> days
            minLockAmount: Number(formatEther(term.minLockAmount)).toFixed(0),
            multiplier: term.multiplier,
            enabled: term.enabled,
            pearlBalance,
            boostPoint,
            apy: 0,
            rewardRate: 0,
            note: {
              name,
              symbol,
              noteAddress: term.note,
            },
          };
        })(i),
      );
    }

    const rawTerms = await Promise.all(actions);
    const groupedTerms = groupBy(rawTerms, term => term.lockPeriod);
    const terms = Object.keys(groupedTerms).map(key => {
      const term = groupedTerms[key].find(term => Number(term.minLockAmount) > 0) || groupedTerms[key][0];
      const fallbackTerm = groupedTerms[key].find(term => Number(term.minLockAmount) === 0);
      const nextReward = ((term.boostPoint + (fallbackTerm?.boostPoint ?? 0)) / totalBoostPoint) * totalNextReward;
      const rewardRate = nextReward / (term.pearlBalance + (fallbackTerm?.pearlBalance ?? 0));
      term.apy = (1 + (rewardRate + stakingRebase)) ** 1095 - 1;
      term.rewardRate = rewardRate;
      if (fallbackTerm) {
        fallbackTerm.apy = term.apy;
        fallbackTerm.rewardRate = term.rewardRate;
      }
      return {
        ...term,
        fallbackTerm: fallbackTerm?.noteAddress === term.noteAddress ? undefined : fallbackTerm,
      };
    });
    return { terms };
  },
);

interface ILoadPearlAllowance {
  address: string;
  chainID: number;
  provider: JsonRpcProvider;
}

export const loadPearlAllowance = createAsyncThunk(
  'otterLake/loadPearlAllowance',
  async ({ address, chainID, provider }: ILoadPearlAllowance, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);
    const allowance = (
      await pearlContract.connect(provider.getSigner()).allowance(address, addresses.OTTER_LAKE)
    ).toString();
    dispatch(updateAllowance(allowance));
  },
);

interface ILoadLockNotesPayload {
  address: string;
  chainID: number;
  provider: JsonRpcProvider;
}

export const loadLockedNotes = createAsyncThunk<{ lockNotes: ILockNote[] }, ILoadLockNotesPayload, ThunkOptions>(
  'otterLake/loadLockedNotes',
  async ({ address, chainID, provider }: ILoadLockNotesPayload, { getState }) => {
    const groupedTerms = getState().lake.terms as ITerm[];
    const epoch = getState().app.currentEpoch;
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    const rewardRates: { [key: string]: number } = {};
    const lockNotes: ILockNote[] = (
      await Promise.all(
        groupedTerms
          .flatMap(t => [t, t.fallbackTerm])
          .filter(Boolean)
          .map(async term => {
            const noteAddress = term!.noteAddress;
            rewardRates[term!.noteAddress] = term!.rewardRate;
            const noteContract = new ethers.Contract(noteAddress, PearlNote, provider);
            const lockNotesCount = await noteContract.balanceOf(address);
            const notes: ILockNote[] = [];
            for (let j = 0; j < lockNotesCount.toNumber(); j += 1) {
              const id = await noteContract.tokenOfOwnerByIndex(address, j);
              const [lock, tokenURI, reward] = await Promise.all([
                noteContract.lockInfos(id),
                noteContract.tokenURI(id),
                otterLakeContract.reward(noteAddress, id),
              ]);
              let imageUrl = '';
              try {
                const tokenMeta = await axios.get(tokenURI);
                imageUrl = tokenMeta.data.image;
              } catch (err) {
                console.warn('get token meta failed: ' + tokenURI);
              }

              notes.push({
                name: term!.note.name,
                imageUrl,
                noteAddress,
                tokenId: id.toString(),
                amount: Number(formatEther(lock.amount)),
                reward: Number(formatEther(reward)),
                endEpoch: lock.endEpoch.toNumber(),
                nextReward: 0,
                rewardRate: 0,
              });
            }
            return notes;
          }),
      )
    ).flatMap(t => t);

    lockNotes.forEach(n => {
      if (epoch < n.endEpoch) {
        n.rewardRate = rewardRates[n.noteAddress];
        n.nextReward = Number(n.amount) * n.rewardRate;
      }
    });

    return { lockNotes };
  },
);

const updateAllowance = createAction<string>('otterLake/updateAllowance');

export const approveSpending = createAsyncThunk(
  'otterLake/approveSpending',
  async ({ chainID, provider }: IApproveSpendingPayload, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);
    let tx: any;
    try {
      tx = await pearlContract.connect(provider.getSigner()).approve(addresses.OTTER_LAKE, constants.MaxUint256);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Processing',
          type: 'lake-approve_pearl',
        }),
      );
      await tx.wait();
      await dispatch(updateAllowance(constants.MaxInt256.toString()));
    } catch (error: any) {
      SnackbarUtils.error((error as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
  },
);

export const claimReward = createAsyncThunk<void, IClaimRewardDetails, ThunkOptions>(
  'otterLake/claimReward',
  async ({ chainID, provider, address, noteAddress, tokenId }: IClaimRewardDetails, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    let tx;

    try {
      tx = await otterLakeContract.connect(provider.getSigner()).claimReward(noteAddress, tokenId);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Claim reward',
          type: 'claim-reward_' + noteAddress + '_' + tokenId,
        }),
      );
      await tx.wait();
      dispatch(loadLockedNotes({ address, chainID, provider }));
    } catch (err) {
      SnackbarUtils.error((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
  },
);

export const redeem = createAsyncThunk<void, IRedeemDetails, ThunkOptions>(
  'otterLake/redeem',
  async ({ chainID, provider, noteAddress, address, tokenId }: IRedeemDetails, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    let tx;

    try {
      tx = await otterLakeContract.connect(provider.getSigner()).exit(noteAddress, tokenId);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Redeem',
          type: 'redeem_' + noteAddress + '_' + tokenId,
        }),
      );
      await tx.wait();
      dispatch(loadLockedNotes({ address, chainID, provider }));
    } catch (err) {
      SnackbarUtils.error((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
  },
);

interface LockActionResult {
  user: string;
  note: string;
  tokenId: string;
  amount: string;
}

interface ILockNoteDetails {
  noteAddress: string;
  amount: string;
  chainID: number;
  provider: JsonRpcProvider;
  address: string;
}

export const lock = createAsyncThunk<LockActionResult | undefined, ILockNoteDetails, ThunkOptions>(
  'otterLake/lock',
  async ({ chainID, provider, noteAddress, address, amount }: ILockNoteDetails, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    let tx;
    let lockedEvent: any;

    try {
      tx = await otterLakeContract.connect(provider.getSigner()).lock(noteAddress, ethers.utils.parseEther(amount));
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Lock',
          type: 'lock_' + noteAddress,
        }),
      );
      const result = await tx.wait();
      lockedEvent = result.events.find((event: any) => event.event === 'Locked');
      dispatch(loadLockedNotes({ address, chainID, provider }));
    } catch (error: any) {
      if (error.code === -32603) {
        SnackbarUtils.warning('errors.lockBalance', true);
      } else if (error.code === 'INVALID_ARGUMENT') {
        SnackbarUtils.warning('bonds.purchase.invalidValue', true);
      } else {
        SnackbarUtils.error(error.message);
      }
      return;
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }

    if (lockedEvent) {
      return {
        user: lockedEvent.args[0],
        note: lockedEvent.args[1],
        tokenId: lockedEvent.args[2].toString(),
        amount: ethers.utils.formatEther(lockedEvent.args[3]),
      };
    }
  },
);

export const extendLock = createAsyncThunk<LockActionResult | undefined, IExtendLockDetails, ThunkOptions>(
  'otterLake/extendLock',
  async ({ chainID, provider, noteAddress, amount, address, tokenId }: IExtendLockDetails, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    let tx;
    let lockedEvent;

    try {
      tx = await otterLakeContract
        .connect(provider.getSigner())
        .extendLock(noteAddress, tokenId, ethers.utils.parseEther(amount));
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Extend Lock',
          type: 'extend-lock_' + noteAddress + '_' + tokenId,
        }),
      );
      const result = await tx.wait();
      lockedEvent = result.events.find((event: any) => event.event === 'Locked');
      dispatch(loadLockedNotes({ address, chainID, provider }));
    } catch (err) {
      SnackbarUtils.error((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    if (lockedEvent) {
      return {
        user: lockedEvent.args[0],
        note: lockedEvent.args[1],
        tokenId: lockedEvent.args[2].toString(),
        amount: formatEther(lockedEvent.args[3]),
      };
    }
  },
);

interface IClaimAndLockPayload {
  chainID: number;
  provider: JsonRpcProvider;
  noteAddress: string;
  tokenId: string;
  address: string;
}

export const claimAndLock = createAsyncThunk<LockActionResult | undefined, IClaimAndLockPayload, ThunkOptions>(
  'otterLake/claimAndLock',
  async ({ chainID, provider, noteAddress, address, tokenId }: IClaimAndLockPayload, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    let tx;
    let lockedEvent;

    try {
      tx = await otterLakeContract.connect(provider.getSigner()).claimAndLock(noteAddress, tokenId);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          text: 'Relocking',
          type: 'relock_' + noteAddress + '_' + tokenId,
        }),
      );
      const result = await tx.wait();
      lockedEvent = result.events.find((event: any) => event.event === 'Locked');
      dispatch(loadLockedNotes({ address, chainID, provider }));
    } catch (error: any) {
      if (error.code === -32603) {
        SnackbarUtils.warning('errors.wrapBalance', true);
      } else if (error.code === 'INVALID_ARGUMENT') {
        SnackbarUtils.warning('bonds.purchase.invalidValue', true);
      } else {
        SnackbarUtils.error(error.message);
      }
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    if (lockedEvent) {
      return {
        user: lockedEvent.args[0],
        note: lockedEvent.args[1],
        tokenId: lockedEvent.args[2].toString(),
        amount: lockedEvent.args[3],
      };
    }
  },
);

const otterLakeSlice = createSlice({
  name: 'otter-lake',
  initialState,
  reducers: {
    selectTerm(state, action) {
      state.selectedTerm = action.payload;
    },
    updateAllowance(state, action) {
      state.allowance = action.payload;
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
      })
      .addCase(updateAllowance, (state, action) => {
        state.allowance = action.payload;
      })
      .addCase(loadLockedNotes.pending, (state, action) => {
        state.loadingNotes = true;
      })
      .addCase(loadLockedNotes.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingNotes = false;
      })
      .addCase(loadLockedNotes.rejected, (state, { error }) => {
        state.loadingNotes = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: { app: IOtterLakeSliceState }) => state.app;

export default otterLakeSlice.reducer;

export const { selectTerm } = otterLakeSlice.actions;

export const getOtterLakeState = createSelector(baseInfo, otterLake => otterLake);
