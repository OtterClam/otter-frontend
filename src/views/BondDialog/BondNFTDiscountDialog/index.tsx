import { Dispatch, SetStateAction } from 'react';

import { BackdropProps, Grid } from '@material-ui/core';
import Dialog from 'src/components/Dialog/Dialog';
import NFTDiscountCard from './NFTDiscountCard';

import { NFTDiscountDetail } from './type';
import { MOCKED_NFT_OPTIONS } from './constants';

interface Props extends Omit<BackdropProps, 'children'> {
  selection?: NFTDiscountDetail;
  setSelection: Dispatch<SetStateAction<NFTDiscountDetail | undefined>>;
  onClose(): void;
}
const BondNTFDiscountDialog = ({ selection, setSelection, onClose, ...props }: Props) => {
  const onSelect = (option: NFTDiscountDetail) => {
    setSelection(option);
    onClose();
  };
  return (
    <Dialog {...props} className="nft-dialog" title="Select Discount NFT" onClose={onClose}>
      <Grid container direction="column" justifyContent="center">
        {MOCKED_NFT_OPTIONS.map(option => (
          <NFTDiscountCard
            key={option.key}
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
