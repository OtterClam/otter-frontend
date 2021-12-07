import { Typography, Box, useTheme } from '@material-ui/core';
import './cards.scss';
import NFTBack from './images/nft-back.jpg';
import NFT1 from './images/nft1.jpg';
import NFT2 from './images/nft2.jpg';

const nfts = [
  {
    name: 'Safe-Hand Otter',
    description:
      'Awarded to every Otter who has staked for a minimum of 2 weeks with greater than 4 sCLAM on the drop date.',
    image: NFT1,
  },
  {
    name: 'Furry-Hand Otter',
    description:
      'Awarded to every Otter who has staked for a minimum of 2 weeks with more than 40 sCLAM on the drop date',
    image: NFT2,
  },
  {
    name: 'Stone-Hand Otter',
    description: 'Awarded to wallets with over 56 sCLAM that have staked from 11/9 to drop date.',
    image: NFTBack,
  },
  {
    name: 'Diamond-Hand Otter',
    description:
      'Awarded for staking the full amount of CLAM from IDO or launch date (11/3, with a minimum of 20 sCLAM) to drop date',
    image: NFTBack,
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
            <figure className="nft-card__image">
              <img src={nft.image} />
            </figure>
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
