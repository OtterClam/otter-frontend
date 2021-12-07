import { Box, Typography } from '@material-ui/core';
import './hero.scss';

const title = 'NFT Giveaway Party';
const subtitle = 'OtterClam NFT giveaway party will be held on';
const date = 'Dec 24, 2021';

export default function NFTHero() {
  return (
    <Box className="nft-hero" component="section" color="text.primary" textAlign="center">
      <div className="nft-hero__content">
        <Typography className="nft-hero__title" variant="h2" component="h1">
          {title}
        </Typography>
        <Typography className="nft-hero__subtitle" variant="h2" component="span">
          {subtitle}
          <br />
          {date}
        </Typography>
      </div>
    </Box>
  );
}
