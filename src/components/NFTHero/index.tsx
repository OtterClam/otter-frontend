import { Box, Typography } from '@material-ui/core';
import './hero.scss';

const title = 'NFT Giveaway Party';
const subtitle = 'OtterClam NFT giveaway party will be held from Dec 1, 2021 0:00 UTC to DEC 2, 2021 23:59 UTC.';

export default function NFTHero() {
  return (
    <Box className="nft-hero" component="section" color="text.primary" textAlign="center">
      <div className="nft-hero__content">
        <Typography className="nft-hero__title" variant="h2" component="h1">
          {title}
        </Typography>
        <Typography className="nft-hero__subtitle" variant="h2" component="span">
          {subtitle}
        </Typography>
      </div>
    </Box>
  );
}
