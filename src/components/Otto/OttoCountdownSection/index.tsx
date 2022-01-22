import Countdown from 'src/components/common/Countdown';
import OttoBuyClamHint from './OttoBuyClamHint';
import OttoDecoLeftImage from 'src/assets/images/decos/image-countdown_deco_left.png';
import OttoDecoRightImage from 'src/assets/images/decos/image-countdown_deco_right.png';

import { Typography, makeStyles } from '@material-ui/core';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.mode.darkBlue,
  },
  h4: {
    color: theme.palette.mode.white,
    fontSize: '48px',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '10px',
  },
  deco: {
    width: '30%',
  },
}));

const OttoCountdownSection = () => {
  const classes = useStyles();
  return (
    <div className={`otto-countdown__container ${classes.container}`}>
      <img className={`otto-countdown__deco left ${classes.deco}`} src={OttoDecoLeftImage} />
      <Typography className={classes.h4} variant="h4">
        Strengthen Otter Kingdom
      </Typography>
      <Countdown
        title="Mint Countdown"
        color="mode.white"
        bgcolor="mode.darkBlue"
        dueDate={new Date()}
        onTimeUp={() => {}}
      />
      {/* TODO|OTTO: add time up callback */}
      <OttoBuyClamHint />
      <img className={`otto-countdown__deco right ${classes.deco}`} src={OttoDecoRightImage} />
    </div>
  );
};
export default OttoCountdownSection;
