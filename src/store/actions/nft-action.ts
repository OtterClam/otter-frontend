import { ethers } from 'ethers';
import { ERC721, OtterPAWBondStakeDepository } from 'src/abi';
import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { contractForBond } from 'src/helpers';
import { BondKey, BondKeys, getAddresses, getBond } from '../../constants';

interface NFTActionProps {
  address: string;
  provider: JsonRpcProvider;
}

// [TODO:d0c0q] action for this view: https://www.figma.com/file/GOojXCnlNhX9cUCbnSZLA4/OtterClam-Internal?node-id=1193%3A9346
export const listNFTDiscount = createAsyncThunk(
  'nft/listNFTDiscount',
  async ({ provider, address }: NFTActionProps) => {
    return listDiscounts({ provider, address });
  },
);

// [TODO:d0c0q] action for this view: https://www.figma.com/file/GOojXCnlNhX9cUCbnSZLA4/OtterClam-Internal?node-id=1204%3A9961
export const listBondWithNFT = createAsyncThunk(
  'nft/listBondWithNFT',
  async ({ provider, address }: NFTActionProps) => {},
);

const bondContract = ({ provider, address }: NFTActionProps) => {
  return new ethers.Contract(address, OtterPAWBondStakeDepository, provider);
};

const allNFTContracts = async ({ provider, address }: NFTActionProps) => {
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

export const listDiscounts = async ({ provider, address }: NFTActionProps) => {
  const bond = bondContract({ provider, address });
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

export const listMyNFT = async ({ provider, address, wallet }: NFTActionProps & { wallet: string }) => {
  const contracts = await allNFTContracts({ provider, address });
  const nfts = await Promise.all(
    contracts.map(async c => {
      const name = await c.name();
      const n = (await c.balanceOf(wallet)).toNumber();
      const ids = await Promise.all(
        Array(n)
          .fill(0)
          .map(async (_, i) => (await c.tokenOfOwnerByIndex(wallet, i)).toNumber()),
      );
      return {
        name,
        balance: n,
        ids,
      };
    }),
  );
  return nfts;
};
