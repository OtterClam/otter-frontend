import { format } from 'date-fns';

import './nftCard.scss';
import { Box, Grid, makeStyles } from '@material-ui/core';

import { NFTDiscountOption } from '../types';

const useStyle = makeStyles(theme => {
  return {
    nftCard: {
      backgroundColor: theme.palette.mode.white,
    },
  };
});

interface CardProps {
  option: NFTDiscountOption;
  selected: boolean;
  onSelect(option: NFTDiscountOption): void;
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
        <Box component="div" flexDirection="column" className="nft-description">
          <h3 className="nft-name">{option.name}</h3>
          <p className="nft-discount">
            {option.type === 'nft'
              ? `Use this note to receive a ${option.discount * 100}% discount on any (4,4) bond.`
              : `${option.discount * 100}% off in addition`}
          </p>
          <p className="nft-expire-time">{`Expiration date: ${format(option.endDate, 'yyyy/MM/dd')}`}</p>
        </Box>
      </Grid>
    </Box>
  );
};

export default NFTDiscountCard;
