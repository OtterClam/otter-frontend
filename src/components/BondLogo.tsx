import { isBondLP, getTokenImage, getPairImage } from '../helpers';
import { Box } from '@material-ui/core';

interface IBondHeaderProps {
  bond: string;
}

function BondHeader({ bond }: IBondHeaderProps) {
  const reserveAssetImg = () => {
    if (bond.indexOf('clam') >= 0) {
      return getTokenImage('clam');
    } else if (bond.indexOf('mai') >= 0) {
      return getTokenImage('mai');
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={'74px'}>
      {isBondLP(bond) ? getPairImage(bond) : reserveAssetImg()}
    </Box>
  );
}

export default BondHeader;
