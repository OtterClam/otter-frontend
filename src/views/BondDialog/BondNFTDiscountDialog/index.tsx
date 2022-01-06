import { useMemo, Dispatch, SetStateAction } from 'react';

import { BackdropProps } from '@material-ui/core';
import Dialog from 'src/components/Dialog/Dialog';
import NFTDiscountCardRow from './NtfDiscountCardRow';

import { OtterNft } from './type';
import { DEFAULT_OPTIONS } from './constants';

interface Props extends Omit<BackdropProps, 'children'> {
  selection?: OtterNft;
  setSelection: Dispatch<SetStateAction<OtterNft | undefined>>;
  onClose(): void;
}
const BondNTFDiscountDialog = ({ selection, setSelection, onClose, ...props }: Props) => {
  const options = useMemo(() => {
    return DEFAULT_OPTIONS.filter(option => option !== selection);
  }, [selection]);
  const onSelect = (option: OtterNft) => {
    setSelection(option);
    onClose();
  };
  return (
    <Dialog {...props} className="nft-dialog" title="Select Discount NFT" onClose={onClose}>
      <NFTDiscountCardRow options={options} onSelect={onSelect} />
    </Dialog>
  );
};
export default BondNTFDiscountDialog;
