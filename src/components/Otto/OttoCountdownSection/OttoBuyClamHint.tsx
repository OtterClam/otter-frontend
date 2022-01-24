import { useTranslation } from 'react-i18next';
import { getCLAMTokenImage } from 'src/helpers';
import { Link, makeStyles } from '@material-ui/core';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.darkGray400,
    border: `2px solid ${theme.palette.mode.darkGray300}`,
  },
  content: {
    color: theme.palette.mode.white,
  },
  highlight: {
    color: theme.palette.otter.clamPink,
  },
}));

const OttoBuyClamHint = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={`otto-buy-clam-hint__container ${classes.container}`}>
      <div>{getCLAMTokenImage(60)}</div>
      <div className={`otto-buy-clam-hint__content ${classes.content}`}>{t('otto.countdown.hintDescription')}</div>
      <Link
        className={`otto-buy-clam-hint__highlight ${classes.highlight}`}
        target="__blank"
        href="https://quickswap.exchange/#/swap?outputCurrency=0xC250e9987A032ACAC293d838726C511E6E1C029d"
      >
        {t('otto.countdown.buyNow')}
      </Link>
    </div>
  );
};
export default OttoBuyClamHint;
