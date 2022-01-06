import './successDialog.scss';
import '../bondSelection.scss';
import { Box, Paper } from '@material-ui/core';

import { OtterNft } from '../BondNFTDiscountDialog/type';
import { DISCOUNT_NFTS } from '../BondNFTDiscountDialog/constants';

interface CardProps {
  selection: OtterNft;
}

export const NFTDisplayRow = ({ selection }: CardProps) => {
  const nft = DISCOUNT_NFTS[selection];
  return (
    <Box>
      <p className="bond-nft-title">Discount NFT</p>
      <Paper>
        <Box component="div" className="bond-nft-row">
          <Box className="selection-area">
            <img className={`selection-image ${selection}`} />
            <p>{DISCOUNT_NFTS[selection].name}</p>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NFTDisplayRow;
