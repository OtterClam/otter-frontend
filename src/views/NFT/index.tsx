import { useTheme } from '@material-ui/core';
import { useEffect } from 'react';
import NFTHeader from 'src/components/NFTHeader';
import NFTHero from 'src/components/NFTHero';
import NFTCards from 'src/components/NFTCards';
import NFTCountdown from 'src/components/NFTCountdown';
import NFTFooter from 'src/components/NFTFooter';

const useBodyBackground = () => {
  const theme = useTheme();
  useEffect(() => {
    document.body.style.background = theme.palette.mode.lightGray100;
    document.body.style.paddingTop = '60px';
    return () => {
      document.body.style.background = '';
      document.body.style.paddingTop = '';
    };
  }, [theme]);
};

export default function NFTPage() {
  useBodyBackground();

  return (
    <div>
      <NFTHeader />
      <NFTHero />
      <NFTCards />
      <NFTCountdown />
      <NFTFooter />
    </div>
  );
}
