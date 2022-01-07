import { useEffect } from 'react';
import { Typography, Box, useTheme } from '@material-ui/core';
import './cards.scss';

import NFT1 from './images/nft1.jpg';
import NFT2 from './images/nft2.jpg';
import NFT3 from './images/nft3.jpg';
import NFT4 from './images/nft4.jpg';

import { useTranslation } from 'react-i18next';
import { useWeb3Context } from 'src/hooks';
import { useAppSelector, useAppDispatch } from 'src/store/hook';
import { fetchAll, claim } from 'src/store/slices/nft-giveaway-slice';

const useHighlightStyle = () => {
  const theme = useTheme();
  return {
    color: theme.palette.mode.highlight,
  };
};

interface NFTCardsProps {
  started: boolean;
  onClaimed: (info: any) => void;
}

const defaultNFTCardsProps: NFTCardsProps = {
  started: false,
  onClaimed: () => {},
};

export default function NFTCards({ started, onClaimed } = defaultNFTCardsProps) {
  const dispatch = useAppDispatch();
  const [safeHandState, furryHandState, stoneHandState, diamondHandState] = useAppSelector(state => state.nftGiveaway);
  const { connected, connect, provider, address, chainID } = useWeb3Context();
  const highlightStyle = useHighlightStyle();
  const { t } = useTranslation();

  const nfts = [
    {
      name: 'Safe-Hand Otter',
      description: t('nft.safehandDescription'),
      image: NFT1,
      state: safeHandState,
      onClick: async () => {
        if (connected && safeHandState.whitelisted && !safeHandState.claimed) {
          const { meta } = await dispatch(claim({ address, provider, chainID, nft: 0 }));
          meta.requestStatus === 'fulfilled' && onClaimed({ name: 'Safe-Hand Otter', image: NFT1 });
        }
      },
    },
    {
      name: 'Furry-Hand Otter',
      description: t('nft.furryhandDescription'),
      image: NFT2,
      state: furryHandState,
      onClick: async () => {
        if (connected && furryHandState.whitelisted && !furryHandState.claimed) {
          const { meta } = await dispatch(claim({ address, provider, chainID, nft: 1 }));
          meta.requestStatus === 'fulfilled' && onClaimed({ name: 'Furry-Hand Otter', image: NFT2 });
        }
      },
    },
    {
      name: 'Stone-Hand Otter',
      description: t('nft.stonehandDescription'),
      image: NFT3,
      state: stoneHandState,
      onClick: async () => {
        if (connected && stoneHandState.whitelisted && !stoneHandState.claimed) {
          const { meta } = await dispatch(claim({ address, provider, chainID, nft: 2 }));
          meta.requestStatus === 'fulfilled' && onClaimed({ name: 'Stone-Hand Otter', image: NFT3 });
        }
      },
    },
    {
      name: 'Diamond-Hand Otter',
      description: t('nft.diamondhandDescription'),
      image: NFT4,
      state: diamondHandState,
      onClick: async () => {
        if (connected && diamondHandState.whitelisted && !diamondHandState.claimed) {
          const { meta } = await dispatch(claim({ address, provider, chainID, nft: 3 }));
          meta.requestStatus === 'fulfilled' && onClaimed({ name: 'Diamond-Hand Otter', image: NFT4 });
        }
      },
    },
  ];

  const buttonText = (connected: Boolean, loading: boolean, whitelisted: boolean, claimed: boolean) => {
    if (!connected) {
      return t('common.connectWallet');
    }

    if (loading) {
      return `${t('common.pending')}...`;
    }

    if (!whitelisted) {
      return t('common.notEligible');
    }

    if (!claimed) {
      return t('common.claim');
    }

    return t('common.claimed');
  };

  useEffect(() => {
    if (!connected) {
      return;
    }
    dispatch(fetchAll({ address, provider, chainID }));
  }, [connected, address, provider, chainID]);

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
            {started && (
              <Box
                bgcolor={
                  connected && nft.state.whitelisted && !nft.state.claimed && !nft.state.loading
                    ? 'otter.otterBlue'
                    : 'mode.lightGray400'
                }
                className="nft-card__button"
                onClick={nft.onClick}
              >
                <p>{buttonText(connected, nft.state.loading, nft.state.whitelisted, nft.state.claimed)}</p>
              </Box>
            )}
          </Box>
        ))}
      </div>
    </Box>
  );
}
