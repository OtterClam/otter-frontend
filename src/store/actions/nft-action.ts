import { ethers } from 'ethers';
import { ERC721, OtterPAWBondStakeDepository } from 'src/abi';
import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { contractForBond } from 'src/helpers';
import { BondKey, BondKeys, getAddresses, getBond } from '../../constants';

interface NFTActionProps {
  address: string;
  provider: JsonRpcProvider;
  wallet: string;
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

export const listDiscounts = async ({ provider, address, wallet }: NFTActionProps) => {
  const bond = bondContract({ provider, address });
  const nfts = listMyNFT({ provider, address, wallet });
  const contracts = await allNFTContracts({ provider, address });
  const discountInfo = await Promise.all(
    contracts.map(async c => {
      const discount = await bond.discountOf(c.address);
      const name = await c.name();
      return { name, discount: discount.toNumber() / 10000 };
    }),
  );
  return discountInfo;
};

export const listMyNFT = async ({ provider, address, wallet }: NFTActionProps) => {
  const bond = bondContract({ provider, address });
  const contracts = await allNFTContracts({ provider, address });
  const nfts = await Promise.all(
    contracts.map(async c => {
      const name = await c.name();
      const n = (await c.balanceOf(wallet)).toNumber();
      const tokens = await Promise.all(
        Array(n)
          .fill(0)
          .map(async (_, i) => {
            const id = (await c.tokenOfOwnerByIndex(wallet, i)).toNumber();
            const [discount, endEpoch] = await Promise.all([
              bond.discountOfToken(c.address, id),
              bond.endEpochOf(c.address, id),
            ]);
            return {
              id,
              discount: discount.toNumber(),
              endEpoch: endEpoch.toNumber(),
            };
          }),
      );
      return {
        name,
        balance: n,
        tokens,
      };
    }),
  );
  return nfts;
};

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
