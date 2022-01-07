import { useTheme } from '@material-ui/core';
import { useEffect, useState } from 'react';
import NFTCards from 'src/components/NFTCards';
import NFTConnect from 'src/components/NFTConnect';
import NFTCountdown from 'src/components/NFTCountdown';
import NFTDialog from 'src/components/NFTDialog';
import NFTFooter from 'src/components/NFTFooter';
import NFTHeader from 'src/components/NFTHeader';
import NFTHero from 'src/components/NFTHero';
import { CHRISTMAS_EVE_2021_DATE } from 'src/constants';
import { useAppSelector } from 'src/store/hook';

const useBodyBackground = () => {
  const theme = useTheme();
  useEffect(() => {
    document.body.style.background = theme.palette.mode.white;
    document.body.style.paddingTop = '60px';
    return () => {
      document.body.style.background = '';
      document.body.style.paddingTop = '';
    };
  }, [theme]);
};

export default function NFTPage() {
  const [started, setStarted] = useState(new Date() > CHRISTMAS_EVE_2021_DATE);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState<any>({});
  const [safeHandState, furryHandState, stoneHandState, diamondHandState] = useAppSelector(state => state.nftGiveaway);

  useBodyBackground();

  return (
    <div>
      <NFTHeader />
      <NFTHero />
      <NFTCards
        started={started}
        onClaimed={({ name, image }) => {
          setName(name);
          setImage(image);
          setOpen(true);
        }}
      />
      {started ? (
        <NFTConnect />
      ) : (
        <NFTCountdown
          dueDate={CHRISTMAS_EVE_2021_DATE}
          onTimeUp={() => {
            setStarted(true);
          }}
        />
      )}
      <NFTFooter />
      <NFTDialog
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        name={name}
        image={image}
      />
    </div>
  );
}
