import { Typography, Box, useTheme } from '@material-ui/core';
import './cards.scss';
import NFTBack from './images/nft-back.jpg';
import NFT1 from './images/nft1.jpg';
import NFT2 from './images/nft2.jpg';
import NFT3 from './images/nft3.jpg';
import { useTranslation } from 'react-i18next';

const useHighlightStyle = () => {
  const theme = useTheme();
  return {
    color: theme.palette.mode.highlight,
  };
};

export default function NFTCards() {
  const highlightStyle = useHighlightStyle();
  const { t } = useTranslation();
  const nfts = [
    {
      name: 'Safe-Hand Otter',
      description: t('nft.safehandDescription'),
      image: NFT1,
    },
    {
      name: 'Furry-Hand Otter',
      description: t('nft.furryhandDescription'),
      image: NFT2,
    },
    {
      name: 'Stone-Hand Otter',
      description: t('nft.stonehandDescription'),
      image: NFT3,
    },
    {
      name: 'Diamond-Hand Otter',
      description: t('nft.diamondhandDescription'),
      image: NFTBack,
    },
  ];
  return (
    <Box className="nft-cards" color="text.primary" textAlign="center" component="section">
      <Typography variant="h2" component="h2" className="nft-cards__title">
        {t('nft.which')} <span style={highlightStyle}>Otter NFT</span> {t('nft.willYouGet')}
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
