import { useTranslation } from 'react-i18next';
import Countdown from 'src/components/common/Countdown';
import OttoBuyClamHint from './OttoBuyClamHint';
import OttoDecoLeftImage from 'src/assets/images/decos/image-countdown_deco_left.png';
import OttoDecoRightImage from 'src/assets/images/decos/image-countdown_deco_right.png';

import { makeStyles } from '@material-ui/core';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.darkBlue,
  },
  h4: {
    color: theme.palette.mode.white,
  },
}));

const OttoCountdownSection = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={`otto-countdown__container ${classes.container}`}>
      <img className="otto-countdown__deco left" src={OttoDecoLeftImage} />
      <h4 className={`otto-countdown__title ${classes.h4}`}>{t('otto.countdown.mintTitle')}</h4>
      <p className="otto-countdown__content">COMING SOON</p>
      {/* <Countdown
        title={t('otto.countdown.mintSubtitle')}
        color="mode.white"
        bgcolor="mode.darkBlue"
        dueDate={new Date()}
        onTimeUp={() => {}}
      /> */}
      {/* TODO|OTTO: add time up callback */}
      <OttoBuyClamHint />
      <img className="otto-countdown__deco right" src={OttoDecoRightImage} />
    </div>
  );
};
export default OttoCountdownSection;
