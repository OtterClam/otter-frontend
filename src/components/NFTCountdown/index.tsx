import { Box, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './countdown.scss';
import { useTranslation, Trans } from 'react-i18next';

const PARTY_DATE = new Date(Date.UTC(2021, 11, 24, 13, 0, 0));

const getNumber = (num: number, pos: number) => {
  if (pos === 0) {
    return Math.floor(num / 10);
  }
  return num % 10;
};

const useCountdown = () => {
  const [timeDiff, setTimeDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let timer = setInterval(() => {
      let delta = (PARTY_DATE.getTime() - Date.now()) / 1000;

      const days = Math.floor(delta / 86400);
      delta -= days * 86400;

      const hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      const minutes = Math.floor(delta / 60) % 24;
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

export default function NFTCountdown() {
  const cd = useCountdown();
  const { t } = useTranslation();

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
