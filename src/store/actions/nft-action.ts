import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDays } from 'date-fns';
import { ethers } from 'ethers';
import { ERC721, OtterLake, OtterPAWBondStakeDepository, PearlNote } from 'src/abi';
import { contractForBond } from 'src/helpers';
import { BondKey, BondKeys, getAddresses, getBond, listBonds } from '../../constants';
import { NFT } from '../../views/BondDialog/BondNFTDiscountDialog/constants';

interface NFTActionProps {
  bondAddress: string;
  provider: JsonRpcProvider;
  wallet?: string;
}

const bondContract = ({ provider, bondAddress }: Omit<NFTActionProps, 'wallet'>) => {
  return new ethers.Contract(bondAddress, OtterPAWBondStakeDepository, provider);
};

const pawAddresses = (networkID: number) => {
  const addresses = getAddresses(networkID);
  return [addresses.NFTS.FURRY_HAND, addresses.NFTS.STONE_HAND, addresses.NFTS.DIAMOND_HAND];
};

const allNFTContracts = async ({ provider, bondAddress }: Omit<NFTActionProps, 'wallet'>) => {
  const bond = bondContract({ provider, bondAddress });
  const count = (await bond.nftCount()).toNumber();
  return await Promise.all(
    Array(count)
      .fill(0)
      .map(async (_, i) => {
        const address = await bond.nftAddresses(i);
        return new ethers.Contract(address, ERC721, provider);
      }),
  );
};

export type BondNFTDiscount = {
  key: NFT;
  name: string;
  discount: number;
  endDate: Date;
  address: string;
};

interface ListBondNFTDiscountResponse extends Pick<ListBondNFTDiscountPayload, 'bondKey'> {
  discounts: BondNFTDiscount[];
}

interface ListBondNFTDiscountPayload extends NFTActionProps {
  bondKey: BondKey;
}

export const listBondNFTDiscounts = createAsyncThunk(
  'nft/discount/list',
  async ({ bondKey, provider, bondAddress }: ListBondNFTDiscountPayload): Promise<ListBondNFTDiscountResponse> => {
    const bond = bondContract({ provider, bondAddress });
    const nftContracts = await allNFTContracts({ provider, bondAddress });
    const discounts = await Promise.all(
      nftContracts.map(async (c, index) => {
        const [token, discount, name, symbol] = await Promise.all([
          c.tokenByIndex(index),
          bond.discountOf(c.address),
          c.name(),
          c.symbol(),
        ]);
        const endEpoch = await bond.endEpochOf(c.address, token);
        const endDate = addDays(Date.UTC(2021, 10, 3, 0, 0, 0), endEpoch / 3);
        return { name, key: symbol, discount: discount.toNumber() / 10000, endDate, address: c.address };
      }),
    );
    return { bondKey, discounts };
  },
);

interface BatchListBondNFTDiscountPayload {
  provider: JsonRpcProvider;
  networkID: number;
}

export const batchListBondNFTDiscounts = createAsyncThunk(
  'nft/discount/batch',
  async ({ networkID, provider }: BatchListBondNFTDiscountPayload, { dispatch }) => {
    const bonds = listBonds(networkID);
    await Promise.all(
      BondKeys.filter(k => bonds[k].supportNFT).map(bondKey => {
        dispatch(listBondNFTDiscounts({ bondKey, provider, bondAddress: bonds[bondKey].address }));
      }),
    );
  },
);

interface ListMyNFTPayload {
  provider: JsonRpcProvider;
  wallet: string;
  networkID: number;
}

export type NFTType = 'note' | 'nft';
export type MyNFTInfo = {
  type: NFTType;
  id: number;
  name: string;
  key: NFT;
  balance: number;
  address: string;
};
export type MyBondedNFTInfo = Pick<MyNFTInfo, 'type' | 'key'>;

export const listMyNFT = createAsyncThunk(
  'account/nft/list',
  async ({ provider, wallet, networkID }: ListMyNFTPayload): Promise<MyNFTInfo[]> => {
    const addresses = getAddresses(networkID);
    const nftAddresses = pawAddresses(networkID);
    // get owned nft infos
    const nftContracts = nftAddresses.map(address => new ethers.Contract(address, ERC721, provider.getSigner()));
    const paws = (
      await Promise.all(
        nftContracts.map(async contract => {
          const [name, symbol, rawBalance] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.balanceOf(wallet),
          ]);
          const balance = rawBalance.toNumber();
          const basicInfos = {
            type: 'nft' as NFTType,
            name: name as string,
            key: symbol as NFT,
            balance: balance as number,
            address: contract.address,
          };
          const ids = await Promise.all(
            Array(balance)
              .fill(0)
              .map(async (_, index) => {
                return (await contract.tokenOfOwnerByIndex(wallet, index)).toNumber();
              }),
          );
          return ids.map(id => ({
            ...basicInfos,
            id,
          }));
        }),
      )
    ).flat(1);

    console.log(`paws: ${JSON.stringify(paws)}`);
    // get owned notes infos
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    const termsCount = (await otterLakeContract.termsCount()).toNumber();
    const notes = (
      await Promise.all(
        Array(termsCount)
          .fill(0)
          .map(async (_, index) => {
            const termAddress = await otterLakeContract.termAddresses(index);
            const term = await otterLakeContract.terms(termAddress);
            const noteContract = new ethers.Contract(term.note, PearlNote, provider);
            const [name, symbol, rawBalance] = await Promise.all([
              noteContract.name(),
              noteContract.symbol(),
              noteContract.balanceOf(wallet),
            ]);
            const balance = rawBalance.toNumber();
            const basicInfos = {
              type: 'note' as NFTType,
              name: name as string,
              key: symbol as NFT,
              balance: balance as number,
              address: noteContract.address,
            };
            const ids = await Promise.all(
              Array(balance)
                .fill(0)
                .map(async (_, index) => {
                  return (await noteContract.tokenOfOwnerByIndex(wallet, index)).toNumber() as number;
                }),
            );
            return ids.map(id => ({
              ...basicInfos,
              id,
            }));
          }),
      )
    ).flat(1);
    console.log(`notes: ${JSON.stringify(notes)}`);
    return [...paws, ...notes];
  },
);

interface ListLockedNFTPayload {
  provider: JsonRpcProvider;
  wallet?: string;
  networkID: number;
  bondKey: BondKey;
}

export type LockedNFT = Omit<MyNFTInfo, 'balance'>;
export interface ListLockedNFTDetail {
  lockedNFTs: LockedNFT[];
  bondKey: BondKey;
}

export const listLockedNFT = createAsyncThunk(
  'bond/nft/locked/list',
  async ({ provider, networkID, wallet, bondKey }: ListLockedNFTPayload): Promise<ListLockedNFTDetail> => {
    if (!wallet || !getBond(bondKey, networkID).supportNFT) return { bondKey, lockedNFTs: [] };
    const bond = contractForBond(bondKey, networkID, provider);
    const nftAddresses = pawAddresses(networkID);
    const info = await bond.bondInfo(wallet);
    const count = info.discountsCount.toNumber();
    const nfts = await Promise.all(
      Array(count)
        .fill(0)
        .map(async (_, i) => {
          const discount = await bond.discountsUsed(wallet, i);
          const nftContract = new ethers.Contract(discount.nft, ERC721, provider);
          const [name, symbol] = await Promise.all([nftContract.name(), nftContract.symbol()]);
          return {
            id: discount.tokenID.toNumber() as number,
            address: discount.nft as string,
            type: (nftAddresses.includes(discount.nft) ? 'nft' : 'note') as NFTType,
            key: symbol as NFT,
            name: name as string,
          };
        }),
    );
    return {
      lockedNFTs: nfts,
      bondKey,
    };
  },
);

interface ApproveNFTPayload {
  address: string;
  bondKey: BondKey;
  networkID: number;
  provider: JsonRpcProvider;
  nftAddress: string;
  tokenId: number;
}

export const approveNFT = createAsyncThunk(
  'account/nft/approve',
  async ({ address, bondKey, networkID, provider, nftAddress, tokenId }: ApproveNFTPayload): Promise<string> => {
    const bond = getBond(bondKey, networkID);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nftAddress, ERC721, signer);
    await (await nftContract.approve(bond.address, tokenId)).wait();
    return bondKey;
  },
);
