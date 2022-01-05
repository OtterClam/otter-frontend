import { useMediaQuery } from '@material-ui/core';
import { tabletMediaQuery } from 'src/themes/mediaQuery';

import { Grid } from '@material-ui/core';
import { DesktopNFTDiscountCard, TabletNFTDiscountCard } from './NFTDiscountCard';

import { OtterNft } from './type';

interface Props {
  options: OtterNft[];
  onSelect(option: OtterNft): void;
}

const NFTDiscountCardRow = ({ options, onSelect }: Props) => {
  const isTablet = useMediaQuery(tabletMediaQuery);
  if (isTablet)
    return (
      <Grid container direction="column" justifyContent="center">
        {options.map(option => (
          <TabletNFTDiscountCard key={option} option={option} onSelect={onSelect} />
        ))}
      </Grid>
    );
  return (
    <Grid container direction="row" justifyContent="center">
      {options.map(option => (
        <DesktopNFTDiscountCard key={option} option={option} onSelect={onSelect} />
      ))}
    </Grid>
  );
};
export default NFTDiscountCardRow;
