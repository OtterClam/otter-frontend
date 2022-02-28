import { Box, Divider, Paper } from '@material-ui/core';

import { NFTDiscountOption } from '../../types';

interface CardProps {
  selections: NFTDiscountOption[];
  renderRowDescription(selection: NFTDiscountOption): JSX.Element;
}

export const NFTDisplayRow = ({ selections, renderRowDescription }: CardProps) => {
  return (
    <Box>
      <p className="bond-nft-title">Discount NFT return</p>
      <Paper style={{ marginTop: '10px' }}>
        {selections.map((selection, index) => (
          <div key={`${selection.id}-${index}`}>
            <Box className="bond-nft-row" component="div">
              <Box className="selection-area">
                <img className={`selection-image ${selection.key}`} />
                <Box>
                  <p className="selection-name">{selection.name}</p>
                  {renderRowDescription(selection)}
                </Box>
              </Box>
            </Box>
            {index !== selections?.length - 1 && <Divider style={{ margin: 0 }} />}
          </div>
        ))}
      </Paper>
    </Box>
  );
};

export default NFTDisplayRow;
