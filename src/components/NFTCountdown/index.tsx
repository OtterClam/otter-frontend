import { Box, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './countdown.scss';

const getNumber = (num: number, pos: number) => {
  if (pos === 0) {
    return Math.floor(num / 10);
  }
  return num % 10;
};

const useCountdown = (dueDate: Date) => {
  const [timeDiff, setTimeDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let timer = setInterval(() => {
      let delta = (dueDate.getTime() - Date.now()) / 1000;

      const days = Math.floor(delta / 86400);
      delta -= days * 86400;

      const hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      const minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;

      const seconds = Math.floor(delta % 60);

      setTimeDiff({
        days,
        hours,
        minutes,
        seconds,
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return timeDiff;
};

const Number = ({ value }: { value: number }) => {
  return (
    <Box bgcolor="otter.otterBlue" component="span" className="nft-cd__number">
      <Typography component="span">{value}</Typography>
    </Box>
  );
};

interface NFTCountdownProps {
  onTimeUp: () => void;
  dueDate: Date;
}

export default function NFTCountdown({ onTimeUp, dueDate }: NFTCountdownProps) {
  const cd = useCountdown(dueDate);
  const { t } = useTranslation();

  useEffect(() => {
    if (cd.days < 0) {
      onTimeUp();
    }
  }, [cd.days]);

  return (
    <section className="nft-cd">
      <Box
        className="nft-cd__content"
        color="text.primary"
        bgcolor="mode.lightGray200"
        textAlign="center"
        component="div"
      >
        <Typography variant="h4" component="h2" className="nft-cd__title">
          {t('nft.airdropCountdown')}
        </Typography>
        <div className="nft-cd__numbers">
          <div className="nft-cd__number-group">
            <Number value={getNumber(cd.days, 0)} />
            <Number value={getNumber(cd.days, 1)} />
            <Typography component="span" className="nft-cd__number-label">
              {t('time.days')}
            </Typography>
          </div>

          <div className="nft-cd__number-group">
            <Number value={getNumber(cd.hours, 0)} />
            <Number value={getNumber(cd.hours, 1)} />
            <Typography component="span" className="nft-cd__number-label">
              {t('time.hours')}
            </Typography>
          </div>

          <div className="nft-cd__number-group">
            <Number value={getNumber(cd.minutes, 0)} />
            <Number value={getNumber(cd.minutes, 1)} />
            <Typography component="span" className="nft-cd__number-label">
              {t('time.minutes')}
            </Typography>
          </div>

          <div className="nft-cd__number-group">
            <Number value={getNumber(cd.seconds, 0)} />
            <Number value={getNumber(cd.seconds, 1)} />
            <Typography component="span" className="nft-cd__number-label">
              {t('time.seconds')}
            </Typography>
          </div>
        </div>
      </Box>
    </section>
  );
}
