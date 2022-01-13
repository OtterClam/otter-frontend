import './successDialog.scss';
import '../bondSelection.scss';
import { Box, Paper } from '@material-ui/core';

import { NFTDiscountDetail } from '../BondNFTDiscountDialog/type';

interface CardProps {
  selection?: NFTDiscountDetail;
}

export const NFTDisplayRow = ({ selection }: CardProps) => {
  return (
    <Box>
      <p className="bond-nft-title">Discount NFT</p>
      <Paper>
        <Box component="div" className="bond-nft-row">
          <Box className="selection-area">
            <img className={`selection-image ${selection?.key}`} />
            <p>{selection?.name}</p>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NFTDisplayRow;