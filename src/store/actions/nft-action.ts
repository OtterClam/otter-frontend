import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDays, format } from 'date-fns';

import { ERC721, OtterPAWBondStakeDepository, PearlNote, OtterPAW, OtterLake } from 'src/abi';
import { BondKey, BondKeys, getAddresses, listBonds } from '../../constants';

interface NFTActionProps {
  address: string;
  provider: JsonRpcProvider;
  wallet?: string;
}

// [TODO:d0c0q] action for this view: https://www.figma.com/file/GOojXCnlNhX9cUCbnSZLA4/OtterClam-Internal?node-id=1193%3A9346
export const listNFTDiscount = createAsyncThunk(
  'nft/listNFTDiscount',
  async ({ provider, address }: NFTActionProps) => {},
);

// [TODO:d0c0q] action for this view: https://www.figma.com/file/GOojXCnlNhX9cUCbnSZLA4/OtterClam-Internal?node-id=1204%3A9961
export const listBondWithNFT = createAsyncThunk(
  'nft/listBondWithNFT',
  async ({ provider, address }: NFTActionProps) => {},
);

const bondContract = ({ provider, address }: Omit<NFTActionProps, 'wallet'>) => {
  return new ethers.Contract(address, OtterPAWBondStakeDepository, provider);
};

const allNFTContracts = async ({ provider, address }: Omit<NFTActionProps, 'wallet'>) => {
  const bond = bondContract({ provider, address });
  const count = (await bond.pawCount()).toNumber();
  return await Promise.all(
    Array(count)
      .fill(0)
      .map(async (_, i) => {
        const address = await bond.pawAddresses(i);
        return new ethers.Contract(address, ERC721, provider);
      }),
  );
};

type BondNFTDiscount = {
  name: string;
  discount: number;
};

interface ListBondNFTDiscountResponse extends Pick<ListBondNFTDiscountPayload, 'bondKey'> {
  discounts: any;
}

interface ListBondNFTDiscountPayload extends NFTActionProps {
  bondKey: BondKey;
}

export const listBondNFTDiscounts = createAsyncThunk(
  'nft/discount/list',
  async ({ bondKey, provider, address }: ListBondNFTDiscountPayload): Promise<ListBondNFTDiscountResponse> => {
    const bond = bondContract({ provider, address });
    const nftContracts = await allNFTContracts({ provider, address });
    const discounts = await Promise.all(
      nftContracts.map(async (c, index) => {
        const token = await c.tokenByIndex(index);
        const endEpoch = await bond.endEpochOf(c.address, token);
        const discount = (await bond.discountOf(c.address)).toNumber() / 10000;
        const name = await c.name();
        const endDate = format(addDays(Date.UTC(2021, 10, 3, 0, 0, 0), endEpoch / 3), 'yyyy/MM/dd');
        return { name, discount, endDate };
      }),
    );
    return { bondKey, discounts };
  },
);

interface BatchListBondNFTDiscountPayload {
  provider: JsonRpcProvider;
  networkId: number;
}

export const batchListBondNFTDiscounts = createAsyncThunk(
  'nft/discount/batch',
  async ({ networkId, provider }: BatchListBondNFTDiscountPayload, { dispatch }) => {
    const bonds = listBonds(networkId);
    await Promise.all(
      BondKeys.map(bondKey => {
        dispatch(listBondNFTDiscounts({ bondKey, provider, address: bonds[bondKey].address }));
      }),
    );
  },
);

type Token = {
  id: string;
  discount: number;
  endEpoch: number; // this is otter time unit, 1 epoch means 1 hour after the first day of Otter Era lol;
};

interface NFT {
  name: string;
  balance: number;
  tokens: Token[];
}

interface ListMyNFTPayload {
  provider: JsonRpcProvider;
  wallet: string;
  networkId: number;
}

type NFTType = 'note' | 'nft';
interface MyNFTInfos {
  type: NFTType;
  name: string;
  symbol: string;
  balance: number;
}

export const listMyNFT = createAsyncThunk(
  'account/nft/list',
  async ({ provider, wallet, networkId }: ListMyNFTPayload) => {
    const addresses = getAddresses(networkId);
    let ownedNFTs: string[] = [];

    // get owned nft infos
    const nftAddresses = [
      addresses.NFTS.SAFE_HAND,
      addresses.NFTS.FURRY_HAND,
      addresses.NFTS.STONE_HAND,
      addresses.NFTS.DIAMOND_HAND,
    ];
    const nftContracts = nftAddresses.map(address => new ethers.Contract(address, OtterPAW, provider.getSigner()));
    const myNFTInfos = await Promise.all(
      nftContracts.map(async contract => {
        const [name, symbol, balance] = await Promise.all([
          await contract.name(),
          await contract.symbol(),
          Number(await contract.balanceOf(wallet)),
        ]).then(res => res);
        if (balance > 0) {
          Array(balance)
            .fill(0)
            .map(() => {
              ownedNFTs.push(symbol);
            });
        }
        return { type: 'nft' as NFTType, name: name as string, symbol: symbol as string, balance };
      }),
    );

    // get owned notes infos
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    const termsCount = (await otterLakeContract.termsCount()).toNumber();
    const myNoteInfos = await Promise.all(
      Array(termsCount)
        .fill(0)
        .map(async (_, index) => {
          const termAddress = await otterLakeContract.termAddresses(index);
          const term = await otterLakeContract.terms(termAddress);
          const noteContract = new ethers.Contract(term.note, PearlNote, provider);
          const [name, symbol, balance] = await Promise.all([
            await noteContract.name(),
            await noteContract.symbol(),
            Number(await noteContract.balanceOf(wallet)),
          ]);
          if (balance > 0) {
            Array(balance)
              .fill(0)
              .map(() => {
                ownedNFTs.push(symbol);
              });
          }
          return { type: 'note' as NFTType, name: name as string, symbol: symbol as string, balance };
        }),
    );

    // combine note and nft together
    return { ownedNFTs, nftInfos: [...myNFTInfos, ...myNoteInfos] };
  },
);

export const listBondedNFT = async ({ provider, address, wallet }: NFTActionProps) => {
  const bond = bondContract({ provider, address });
  let nfts = [];
  let n = 0;
  // max = 10
  for (let i = 0; i < 10; i++) {
    try {
      const info = await bond.discountInfo(wallet, i);
      nfts.push({
        discount: info.discount.toNumber(),
        nftAddress: info.paw,
        tokenID: info.tokenID.toNumber(),
      });
    } catch (err) {
      // console.log(err);
    }
  }
  return nfts;
};
