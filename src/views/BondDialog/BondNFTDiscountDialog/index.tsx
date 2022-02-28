import { Dispatch, SetStateAction, useMemo } from 'react';
import { useAppSelector } from 'src/store/hook';

import { BackdropProps, Grid } from '@material-ui/core';
import Dialog from 'src/components/Dialog/Dialog';
import NFTDiscountCard from './NFTDiscountCard';

import { Bond } from 'src/constants';
import { BondNFTDiscount, MyNFTInfo } from 'src/store/actions/nft-action';

import { NFTDiscountOption } from '../types';
interface Props extends Omit<BackdropProps, 'children'> {
  bond: Bond;
  selection?: NFTDiscountOption;
  setSelection: Dispatch<SetStateAction<NFTDiscountOption | undefined>>;
  onClose(): void;
}
const BondNTFDiscountDialog = ({ bond, selection, setSelection, onClose, ...props }: Props) => {
  const bondNFTDiscounts = useAppSelector(state => state.nft.bondNftDiscounts.data[bond.key]);
  const myNFTs = useAppSelector(state => state.account?.nfts || []);
  const options = useMemo<NFTDiscountOption[]>(() => {
    return myNFTs
      .map((NFT: MyNFTInfo) => {
        const discountsUsed = bondNFTDiscounts.find((discount: BondNFTDiscount) => discount.key === NFT.key);
        return { ...discountsUsed, id: NFT.id };
      })
      .filter((p: any) => p.discount);
  }, [myNFTs]);
  console.log(options);
  const onSelect = (option: NFTDiscountOption) => {
    setSelection(option);
    onClose();
  };
  return (
    <Dialog {...props} className="nft-dialog" title="Select Discount NFT" onClose={onClose}>
      <Grid container direction="column" justifyContent="center">
        {options.map((option, index) => (
          <NFTDiscountCard
            key={`${option.key}-${index}`}
            option={option}
            selected={option.key === selection?.key}
            onSelect={onSelect}
          />
        ))}
      </Grid>
    </Dialog>
  );
};
export default BondNTFDiscountDialog;
