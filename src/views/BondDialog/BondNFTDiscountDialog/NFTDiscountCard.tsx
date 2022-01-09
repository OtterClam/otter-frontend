import './nftCard.scss';
import { Box, Grid, makeStyles } from '@material-ui/core';

import { NFTDiscountDetail } from './type';

const useStyle = makeStyles(theme => {
  return {
    nftCard: {
      backgroundColor: theme.palette.mode.white,
    },
  };
});

interface CardProps {
  option: NFTDiscountDetail;
  selected: boolean;
  onSelect(option: NFTDiscountDetail): void;
}
const NFTDiscountCard = ({ option, selected, onSelect }: CardProps) => {
  const style = useStyle();
  return (
    <Box
      key={option.name}
      component="div"
      className={`nft-discount-card ${selected ? 'selected' : ''} ${style.nftCard}`}
    >
      <Grid container direction="row" wrap="nowrap" onClick={() => onSelect(option)}>
        <div className={`nft-img ${option.key}`} />
        <Box component="div" flex flexDirection="column" className="nft-description">
          <h3 className="nft-name">{option.name}</h3>
          <p className="nft-discount">
            {option.type === 'nft'
              ? `Use this note to receive a ${option.discount} discount on any (4,4) bond.`
              : `${option.discount} off in addition`}
          </p>
          <p className="nft-expire-time">{`Expiration date: ${option.expireAt}`}</p>
        </Box>
      </Grid>
    </Box>
  );
};

export default NFTDiscountCard;
