import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDays } from 'date-fns';
import { ethers } from 'ethers';
import { ERC721, OtterLake, OtterPAWBondStakeDepository, PearlNote } from 'src/abi';
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
  networkId: number;
}

export const batchListBondNFTDiscounts = createAsyncThunk(
  'nft/discount/batch',
  async ({ networkId, provider }: BatchListBondNFTDiscountPayload, { dispatch }) => {
    const bonds = listBonds(networkId);
    await Promise.all(
      BondKeys.filter(k => k === 'mai_clam44').map(bondKey => {
        dispatch(listBondNFTDiscounts({ bondKey, provider, bondAddress: bonds[bondKey].address }));
      }),
    );
  },
);

type Token = {
  id: string;
  discount: number;
  endEpoch: number; // this is otter time unit, 1 epoch means 1 hour after the first day of Otter Era lol;
};

interface ListMyNFTPayload {
  provider: JsonRpcProvider;
  wallet: string;
  networkId: number;
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
  async ({ provider, wallet, networkId }: ListMyNFTPayload): Promise<MyNFTInfo[]> => {
    const addresses = getAddresses(networkId);
    let ownedNFTs: MyNFTInfo[] = [];

    // get owned nft infos
    const nftAddresses = [addresses.NFTS.FURRY_HAND, addresses.NFTS.STONE_HAND, addresses.NFTS.DIAMOND_HAND];
    const nftContracts = nftAddresses.map(address => new ethers.Contract(address, ERC721, provider.getSigner()));
    await Promise.all(
      nftContracts.map(async contract => {
        const [name, symbol, balance] = await Promise.all([
          await contract.name(),
          await contract.symbol(),
          Number(await contract.balanceOf(wallet)),
        ]).then(res => res);
        const basicInfos = {
          type: 'nft' as NFTType,
          name: name as string,
          key: symbol as NFT,
          balance,
          address: contract.address,
        };
        if (balance > 0) {
          Array(balance)
            .fill(0)
            .map(async (_, index) => {
              const id = (await contract.tokenOfOwnerByIndex(wallet, index)).toNumber();
              ownedNFTs.push({ ...basicInfos, id });
            });
        }
      }),
    );

    // get owned notes infos
    const otterLakeContract = new ethers.Contract(addresses.OTTER_LAKE, OtterLake, provider);
    const termsCount = (await otterLakeContract.termsCount()).toNumber();
    await Promise.all(
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
          const basicInfos = {
            type: 'note' as NFTType,
            name: name as string,
            key: symbol as NFT,
            balance,
            address: noteContract.address,
          };
          if (balance > 0) {
            Array(balance)
              .fill(0)
              .map(async () => {
                const id = (await noteContract.tokenOfOwnerByIndex(wallet, index)).toNumber();
                ownedNFTs.push({ ...basicInfos, id });
              });
          }
        }),
    );

    // combine note and nft together
    return ownedNFTs;
  },
);

export const listBondedNFT = async ({ provider, bondAddress, wallet }: NFTActionProps) => {
  const bond = bondContract({ provider, bondAddress });
  const info = await bond.bondInfo(wallet);
  return await Promise.all(
    Array(info.discountsCount)
      .fill(0)
      .map(async (_, i) => {
        const discount = await bond.discountsUsed(wallet, i);
        return {
          discount: discount.discount.toNumber(),
          nftAddress: discount.nft,
          tokenID: discount.tokenID.toNumber(),
        };
      }),
  );
};

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
