import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BigNumber, ethers } from 'ethers';
import { OtterPAW } from 'src/abi';
import { getAddresses } from 'src/constants';

export interface NFTGiveawayState {
  claimed: boolean;
  tokenID: number;
  whitelisted: boolean;
  loading: boolean;
}

interface EthersProps {
  address: string;
  chainID: number;
  provider: JsonRpcProvider;
}

export const fetchAll = createAsyncThunk<{ allWhitelisted: boolean[]; allTokenID: number[] }, EthersProps>(
  'nft-giveaway/fetch-all',
  async ({ address, chainID, provider }) => {
    const addresses = getAddresses(chainID);
    const nftAddresses = [
      addresses.NFTS.SAFE_HAND,
      addresses.NFTS.FURRY_HAND,
      addresses.NFTS.STONE_HAND,
      addresses.NFTS.DIAMOND_HAND,
    ];
    const nftContracts = nftAddresses.map(e => new ethers.Contract(e, OtterPAW, provider.getSigner()));
    const allWhitelisted = await Promise.all(nftContracts.map(async e => (await e.whitelist(address)) as boolean));
    const allTokenID = await Promise.all(
      nftContracts.map(async e => ((await e.claimed(address)) as BigNumber).toNumber()),
    );
    return {
      allWhitelisted,
      allTokenID,
    };
  },
);

export enum OtterNFT {
  SafeHand,
  FurryHand,
  StoneHand,
  DiamondHand,
}
interface ClaimProps extends EthersProps {
  nft: OtterNFT;
}

export const claim = createAsyncThunk<void, ClaimProps>(
  `nft-giveaway/claim`,
  async ({ address, chainID, provider, nft }, { dispatch }) => {
    const addresses = getAddresses(chainID);
    const nftAddresses = [
      addresses.NFTS.SAFE_HAND,
      addresses.NFTS.FURRY_HAND,
      addresses.NFTS.STONE_HAND,
      addresses.NFTS.DIAMOND_HAND,
    ];
    const pawContract = new ethers.Contract(nftAddresses[nft], OtterPAW, provider.getSigner());
    const transfered = () =>
      new Promise<void>(resolve => {
        const event = pawContract.filters.Transfer(null, address);
        const action = () => {
          pawContract.off(event, action);
          resolve();
        };
        pawContract.on(event, action);
      });

    await pawContract.claim();
    await transfered();
    dispatch(fetchAll({ address, chainID, provider }));
  },
);

const initialState: NFTGiveawayState[] = Array(4).fill({
  claimed: false,
  tokenID: 0,
  whitelisted: false,
  loading: false,
});

const nftGiveawaySlice = createSlice({
  name: 'nft-giveaway',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAll.pending, (state, action) => {
        state.forEach(e => {
          e.loading = true;
        });
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.forEach((e, idx) => {
          e.whitelisted = action.payload.allWhitelisted[idx];
          e.tokenID = action.payload.allTokenID[idx];
          e.claimed = action.payload.allTokenID[idx] !== 0;
          e.loading = false;
        });
      })
      .addCase(fetchAll.rejected, (state, { error }) => {
        state.forEach(e => {
          e.loading = false;
        });
        alert(error.message);
      })
      .addCase(claim.pending, (state, { meta }) => {
        state[meta.arg.nft].loading = true;
      })
      .addCase(claim.fulfilled, (state, { meta }) => {
        state[meta.arg.nft].loading = false;
      })
      .addCase(claim.rejected, (state, { error, meta }) => {
        state[meta.arg.nft].loading = false;
        alert(error.message);
      });
  },
});

export default nftGiveawaySlice.reducer;
