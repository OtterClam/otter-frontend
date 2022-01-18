import { Dispatch, SetStateAction } from 'react';

import './bondSelection.scss';
import { Box, Paper } from '@material-ui/core';
import { ReactComponent as ArrowRightIcon } from '../../assets/icons/arrow_right.svg';
import { ReactComponent as ExcludeIcon } from '../../assets/icons/icon_exclude.svg';

import { NFTDiscountOption } from './types';
import { NFT_IMAGES } from './BondNFTDiscountDialog/constants';

const description: Record<string, string> = {
  empty: 'None NFT selected',
  disabled:
    'Opps! You don’t have any otter NFT available. You can get the next season NFT through staking, or OpenSea.',
};

interface BondNFTDiscountProps {
  disabled: boolean;
  selection?: NFTDiscountOption;
  setSelection: Dispatch<SetStateAction<NFTDiscountOption | undefined>>;
  onClick?(): void;
}

const NftRowLeftArea = ({
  disabled,
  selection,
  setSelection,
}: Pick<BondNFTDiscountProps, 'disabled' | 'selection' | 'setSelection'>) => {
  if (disabled) {
    return <p className="description">{description.disabled}</p>;
  }
  if (!selection) {
    return <p className="description">{description.empty}</p>;
  }
  return (
    <>
      <ExcludeIcon className="delete-icon icon" onClick={() => setSelection(undefined)} />
      <img className="selection-image" src={`${NFT_IMAGES[selection.key]}`} />
      <p className="selection-text">
        {selection.name}
        <span className="selection-discount">{selection.discount * 100}% OFF</span>
      </p>
    </>
  );
};

const BondNFTDiscount = ({ selection, setSelection, disabled, onClick }: BondNFTDiscountProps) => {
  return (
    <Box id="bond-nft-discount">
      <p className="bond-balance-title">Discount NFT Selection</p>
      <Paper style={{ marginTop: '10px' }}>
        <Box component="div" className="bond-nft-row">
          <Box className="selection-area">
            <NftRowLeftArea disabled={disabled} selection={selection} setSelection={setSelection} />
          </Box>
          <Box className="select-button" onClick={onClick}>
            <Box className="select-text">Select</Box>
            <Box>
              <ArrowRightIcon className="arrow-icon icon" />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
export default BondNFTDiscount;
