import { Typography, Box, useTheme } from '@material-ui/core';
import './cards.scss';
import NFT1 from './images/nft1.jpg';
import NFT2 from './images/nft2.jpg';

const nfts = [
  {
    name: 'Diamond-Hand Otter',
    description:
      'Awarded for staking the full amount of CLAM from IDO or launch date (11/3, with a minimum of 40 sCLAM) to drop date',
    image: NFT1,
  },
  {
    name: 'Stone-Hand Otter',
    description: 'Awarded to wallets with over 56 sCLAM that have staked from 11/9 to drop date.',
    image: NFT2,
  },
  {
    name: 'Diamond-Hand Otter',
    description:
      'Awarded for staking the full amount of CLAM from IDO or launch date (11/3, with a minimum of 40 sCLAM) to drop date',
    image: NFT1,
  },
  {
    name: 'Diamond-Hand Otter',
    description:
      'Awarded for staking the full amount of CLAM from IDO or launch date (11/3, with a minimum of 40 sCLAM) to drop date',
    image: NFT1,
  },
];

const useHighlightStyle = () => {
  const theme = useTheme();
  return {
    color: theme.palette.mode.highlight,
  };
};

export default function NFTCards() {
  const highlightStyle = useHighlightStyle();

  return (
    <Box className="nft-cards" color="text.primary" textAlign="center" component="section">
      <Typography variant="h2" component="h2" className="nft-cards__title">
        Which <span style={highlightStyle}>Otter NFT</span> you can get
      </Typography>

      <div className="nft-cards__list">
        {nfts.map((nft, index) => (
          <Box bgcolor="mode.lightGray200" className="nft-card" key={index}>
            <img src={nft.image} className="nft-card__image" />
            <Typography style={highlightStyle} className="nft-card__title" component="h4" variant="h5">
              {nft.name}
            </Typography>
            <Typography variant="body2" className="nft-card__description">
              {nft.description}
            </Typography>
          </Box>
        ))}
      </div>
    </Box>
  );
}
