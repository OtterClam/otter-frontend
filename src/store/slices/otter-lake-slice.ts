import groupBy from 'lodash/groupBy';
import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { constants, ethers } from 'ethers';
import { PearlNote, OtterLake, PearlTokenContract } from '../../abi';
import { getAddresses } from '../../constants';
import { setAll } from '../../helpers';
import { fetchPendingTxns, clearPendingTxn } from './pending-txns-slice';
import { formatEther } from '@ethersproject/units';
import axios from 'axios';

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
  terms: ITerm[];
  lockNotes: ILockNote[];
  selectedTerm?: ITerm;
}

const initialState: IOtterLakeSliceState = {
  loading: true,
  terms: [],
  lockNotes: [],
  selectedTerm: undefined,
};

interface ILoadTermsDetails {
  address: string;
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

interface ILockNoteDetails {
  noteAddress: string;
  amount: string;
  chainID: number;
  provider: JsonRpcProvider;
  address: string;
}

interface IExtendLockDetails {
  noteAddress: string;
  amount: string;
  chainID: number;
  provider: JsonRpcProvider;
  tokenId: string;
  address: string;
}

interface IClaimAndLockPayload {
  chainID: number;
  provider: JsonRpcProvider;
  noteAddress: string;
  tokenId: string;
  address: string;
}

export const loadTermsDetails = createAsyncThunk(
  'otterLake/loadTermsDetails',
  async ({ address, chainID, provider }: ILoadTermsDetails) => {
    const { terms, lockNotes } = await getTermsAndLocks(address, chainID, provider);
    return { terms, lockNotes };
  },
);

async function getTermsAndLocks(address: string, chainID: number, provider: JsonRpcProvider) {
  const addresses = getAddresses(chainID);
  const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
  const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);

  const termsCount = (await otterLakeContract.termsCount()).toNumber();
  const epoch = await otterLakeContract.epochs(await otterLakeContract.epoch());
  const totalNextReward = Number(formatEther(epoch.reward));
  const actions: Promise<ITerm>[] = [];
  const lockNotes: ILockNote[] = [];
  let totalBoostPoint = 0;

  for (let i = 0; i < termsCount; i += 1) {
    actions.push(
      (async (i: number) => {
        const termAddress = await otterLakeContract.termAddresses(i);
        const term = await otterLakeContract.terms(termAddress);
        const noteContract = new ethers.Contract(term.note, PearlNote, provider);
        const [lockNotesCount, name, symbol, pearlBalance] = await Promise.all([
          noteContract.balanceOf(address),
          noteContract.name(),
          noteContract.symbol(),
          Number(formatEther(await pearlContract.balanceOf(term.note))),
        ]);
        for (let j = 0; j < lockNotesCount.toNumber(); j += 1) {
          const id = await noteContract.tokenOfOwnerByIndex(address, j);
          const [lock, tokenURI, reward] = await Promise.all([
            noteContract.lockInfos(id),
            noteContract.tokenURI(id),
            otterLakeContract.reward(term.note, id),
          ]);
          let imageUrl = '';
          try {
            const tokenMeta = await axios.get(tokenURI);
            imageUrl = tokenMeta.data.image;
          } catch (err) {
            console.warn('get token meta failed: ' + tokenURI);
          }

          lockNotes.push({
            name,
            imageUrl,
            noteAddress: term.note,
            tokenId: id.toString(),
            amount: Number(formatEther(lock.amount)),
            reward: Number(formatEther(reward)),
            endEpoch: lock.endEpoch.toNumber(),
            nextReward: 0,
            rewardRate: 0,
          });
        }

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
  const rewardRates: { [key: string]: number } = {};

  const terms = Object.keys(groupedTerms).map(key => {
    const term = groupedTerms[key].find(term => Number(term.minLockAmount) > 0) || groupedTerms[key][0];
    const fallbackTerm = groupedTerms[key].find(term => Number(term.minLockAmount) === 0);
    const nextReward = ((term.boostPoint + (fallbackTerm?.boostPoint ?? 0)) / totalBoostPoint) * totalNextReward;
    const rewardRate = nextReward / (term.pearlBalance + (fallbackTerm?.pearlBalance ?? 0));
    term.apy = (1 + rewardRate) ** 1095;
    rewardRates[term.noteAddress] = rewardRate;
    if (fallbackTerm) {
      rewardRates[fallbackTerm.noteAddress] = rewardRate;
    }
    return {
      ...term,
      rewardRate,
      fallbackTerm: fallbackTerm?.noteAddress === term.noteAddress ? undefined : fallbackTerm,
    };
  });
  lockNotes.forEach(n => {
    n.rewardRate = rewardRates[n.noteAddress];
    n.nextReward = Number(n.amount) * n.rewardRate;
  });

  return { terms, lockNotes };
}

export const claimReward = createAsyncThunk(
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
      dispatch(loadTermsDetails({ address, chainID, provider }));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
  },
);

export const redeem = createAsyncThunk(
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
      dispatch(loadTermsDetails({ address, chainID, provider }));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
  },
);

export const lock = createAsyncThunk(
  'otterLake/lock',
  async ({ chainID, provider, noteAddress, address, amount }: ILockNoteDetails, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    let tx;
    let lockedEvent: any;

    try {
      await allowanceGuard(chainID, provider, address, amount);
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
      dispatch(loadTermsDetails({ address, chainID, provider }));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }

    return {
      user: lockedEvent.args[0],
      note: lockedEvent.args[1],
      tokenId: lockedEvent.args[2].toString(),
      amount: ethers.utils.formatEther(lockedEvent.args[3]),
    };
  },
);

const allowanceGuard = async (chainID: number, provider: JsonRpcProvider, address: string, amount: string) => {
  const addresses = getAddresses(chainID);
  const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, provider);
  const allowance = await pearlContract.connect(provider.getSigner()).allowance(address, addresses.OTTER_LAKE);
  if (allowance.lt(ethers.utils.parseEther(amount))) {
    await pearlContract.connect(provider.getSigner()).approve(addresses.OTTER_LAKE, constants.MaxUint256);
  }
};

export const extendLock = createAsyncThunk(
  'otterLake/extendLock',
  async ({ chainID, provider, noteAddress, amount, address, tokenId }: IExtendLockDetails, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    let tx;
    let lockedEvent;

    try {
      await allowanceGuard(chainID, provider, address, amount);
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
      dispatch(loadTermsDetails({ address, chainID, provider }));
    } catch (err) {
      alert((err as Error).message);
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

export const claimAndLock = createAsyncThunk(
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
      dispatch(loadTermsDetails({ address, chainID, provider }));
    } catch (err) {
      alert((err as Error).message);
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

const baseInfo = (state: { app: IOtterLakeSliceState }) => state.app;

export default otterLakeSlice.reducer;

export const { selectTerm } = otterLakeSlice.actions;

export const getOtterLakeState = createSelector(baseInfo, otterLake => otterLake);
