import { getTokenImage, getPairImage } from '../helpers';
import { Box } from '@material-ui/core';
import { Bond, BondKey } from 'src/constants';

interface IBondHeaderProps {
  bond: Bond;
  size?: number;
}

function BondLogo({ bond, size = 32 }: IBondHeaderProps) {
  const reserveAssetImg = (bondKey: BondKey) => {
    if (bondKey.indexOf('clam') >= 0) {
      return getTokenImage('clam', size);
    }
    if (bondKey.indexOf('mai') >= 0) {
      return getTokenImage('mai', size);
    }
    if (bondKey.indexOf('frax') >= 0) {
      return getTokenImage('frax', size);
    }
    if (bondKey.indexOf('matic') >= 0) {
      return getTokenImage('wmatic', size);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width="74px">
      {bond.type === 'lp' ? getPairImage(bond.key, size) : reserveAssetImg(bond.key)}
    </Box>
  );
}

export default BondLogo;
