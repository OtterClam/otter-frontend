import { Box } from '@material-ui/core';
import { isNumber } from 'lodash';
import { MyNFTInfo } from 'src/store/actions/nft-action';

import './nft-display.scss';

interface Props {
  NFTs: MyNFTInfo[];
}
const BondNFTDisplay = ({ NFTs }: Props) => {
  return (
    <Box display="flex" alignItems="center" className="bond-card-nft-row">
      <Box position="relative" width={(NFTs.length - 1) * 10 + 30} height={30} marginRight="10px">
        {NFTs.map((nft, index) => {
          const otterType = /([A-Z]+)([0-9]*)/.exec(nft.key)?.[1] || '';
          const nftType = nft.type === 'nft' ? '' : '_NOTE';
          console.log(/([A-Z]+)([0-9]*)/.exec(nft.key));
          return (
            <Box
              className={`nft-image ${otterType}${nftType}`}
              style={{ position: 'absolute', top: '50%', left: index * 10, transform: 'translateY(-50%)' }}
            />
          );
        })}
      </Box>
      bond with NFT
    </Box>
  );
};

export default BondNFTDisplay;
