import './nftCard.scss';
import { ReactComponent as ArrowRightIcon } from '../../../assets/icons/arrow_right.svg';
import { Box, Grid, makeStyles } from '@material-ui/core';

import { OtterNft } from './type';
import { DISCOUNT_NFTS } from './constants';

const useStyle = makeStyles(theme => {
  return {
    nftCard: {
      backgroundColor: theme.palette.mode.white,
    },
  };
});

interface CardProps {
  option: OtterNft;
  onSelect(option: OtterNft): void;
}

export const TabletNFTDiscountCard = ({ option, onSelect }: CardProps) => {
  const nft = DISCOUNT_NFTS[option];
  const style = useStyle();
  return (
    <Box key={nft.name} component="div" className={`otter-card ${style.nftCard}`}>
      <Grid container direction="row">
        <img className="otter-img" src={nft.image} />
        <Box component="div" flex flexDirection="column">
          <Box className="select-button" onClick={() => onSelect(option)}>
            <Box className="select-text">Select</Box>
            <Box>
              <ArrowRightIcon className="arrow-icon icon" />
            </Box>
          </Box>
          <h3 className="otter-name">{nft.name}</h3>
          <p className="otter-discount">{nft.discount}% OFF</p>
        </Box>
      </Grid>
    </Box>
  );
};

export const DesktopNFTDiscountCard = ({ option, onSelect }: CardProps) => {
  const nft = DISCOUNT_NFTS[option];
  return (
    <Box
      key={nft.name}
      component="div"
      className="desktop otter-card"
      bgcolor="otter.white"
      onClick={() => onSelect(option)}
    >
      <Grid container direction="column">
        <img className="otter-img" src={nft.image} />
        <Box component="div" flexDirection="row">
          <h3 className="otter-name">{nft.name}</h3>
          <p className="otter-discount">{nft.discount}% OFF</p>
        </Box>
      </Grid>
    </Box>
  );
};
