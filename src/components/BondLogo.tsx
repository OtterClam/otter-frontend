import { getTokenImage, getPairImage } from '../helpers';
import { Box } from '@material-ui/core';
import { Bond } from 'src/constants';

interface IBondHeaderProps {
  bond: Bond;
}

function BondLogo({ bond }: IBondHeaderProps) {
  const reserveAssetImg = () => {
    if (bond.key.indexOf('clam') >= 0) {
      return getTokenImage('clam', 36);
    } else if (bond.key.indexOf('mai') >= 0) {
      return getTokenImage('mai', 36);
    } else if (bond.key.indexOf('frax') >= 0) {
      return getTokenImage('frax', 36);
    } else if (bond.key.indexOf('matic') >= 0) {
      return getTokenImage('wmatic', 36);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={'74px'}>
      {bond.type === 'lp' ? getPairImage(bond.key) : reserveAssetImg()}
    </Box>
  );
}

export default BondLogo;
