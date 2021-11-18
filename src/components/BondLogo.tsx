import { getTokenImage, getPairImage } from '../helpers';
import { Box } from '@material-ui/core';
import { Bond } from 'src/constants';

interface IBondHeaderProps {
  bond: Bond;
}

function BondHeader({ bond }: IBondHeaderProps) {
  const reserveAssetImg = () => {
    if (bond.key.indexOf('clam') >= 0) {
      return getTokenImage('clam');
    } else if (bond.key.indexOf('mai') >= 0) {
      return getTokenImage('mai');
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={'74px'}>
      {bond.type === 'lp' ? getPairImage(bond.key) : reserveAssetImg()}
    </Box>
  );
}

export default BondHeader;
