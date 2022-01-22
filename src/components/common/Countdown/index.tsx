import { Box, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCountdown } from './hook';
import { getNumber } from './util';
import './style.scss';

const Number = ({ value }: { value: number }) => {
  return (
    <Box bgcolor="otter.otterBlue" component="span" className="nft-cd__number">
      <Typography component="span">{value}</Typography>
    </Box>
  );
};

interface NFTCountdownProps {
  title: string;
  color?: string;
  bgcolor?: string;
  onTimeUp: () => void;
  dueDate: Date;
}

export default function NFTCountdown({
  title,
  color = 'text.primary',
  bgcolor = 'mode.lightGray200',
  dueDate,
  onTimeUp,
}: NFTCountdownProps) {
  const cd = useCountdown(dueDate);
  const { t } = useTranslation();

  useEffect(() => {
    if (cd.seconds < 0) {
      onTimeUp();
    }
  }, [cd.seconds]);

  return (
    <section className="countdown">
      <Box className="countdown__content" color={color} bgcolor={bgcolor} textAlign="center" component="div">
        <Typography variant="h4" component="h2" className="nft-cd__title">
          {title}
        </Typography>
        <div className="countdown__numbers">
          <div className="countdown__number-group">
            <Number value={getNumber(cd.days, 0)} />
            <Number value={getNumber(cd.days, 1)} />
            <Typography component="span" className="nft-cd__number-label">
              {t('time.days')}
            </Typography>
          </div>

          <div className="countdown__number-group">
            <Number value={getNumber(cd.hours, 0)} />
            <Number value={getNumber(cd.hours, 1)} />
            <Typography component="span" className="countdown__number-label">
              {t('time.hours')}
            </Typography>
          </div>

          <div className="countdown__number-group">
            <Number value={getNumber(cd.minutes, 0)} />
            <Number value={getNumber(cd.minutes, 1)} />
            <Typography component="span" className="countdown__number-label">
              {t('time.minutes')}
            </Typography>
          </div>

          <div className="countdown__number-group">
            <Number value={getNumber(cd.seconds, 0)} />
            <Number value={getNumber(cd.seconds, 1)} />
            <Typography component="span" className="countdown__number-label">
              {t('time.seconds')}
            </Typography>
          </div>
        </div>
      </Box>
    </section>
  );
}
