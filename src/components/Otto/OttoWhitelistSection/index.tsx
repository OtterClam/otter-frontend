import { Typography, makeStyles } from '@material-ui/core';
import RoundedButton from 'src/components/Otto/common/RoundedButton';
import WhiteListRightBg from 'src/assets/images/otto_bg_whitelist_right.png';
import WhiteListLeftBg from 'src/assets/images/otto_bg_whitelist_left.png';

import './style.scss';

const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: theme.palette.mode.white,
  },
  body2: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '25px',
  },
  h2: {
    fontSize: '100px',
    fontWeight: 800,
  },
  h5: {
    fontSize: '36px',
    fontWeight: 800,
    marginBottom: '20px',
  },
  body1: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '36px',
    marginBottom: '40px',
  },
  highlight: {
    color: theme.palette.mode.highlight,
  },
}));

const OttoWhitelistSection = () => {
  const classes = useStyles();
  return (
    <div className="otto-whitelist__container">
      <img className="otto-whitelist__image" src={WhiteListLeftBg} />
      <div className={`otto-whitelist__content ${classes.content}`}>
        <Typography className={classes.body2} variant="body2">
          Initial Released Image Amount:
        </Typography>
        <Typography className={classes.h2} variant="h2">
          3,000{' '}
        </Typography>
        <Typography className={classes.h5} variant="h5">
          Only for Whitelist!
        </Typography>
        <Typography className={classes.body1} variant="body1">
          Lockup your PEARL in <span className={classes.highlight}>180-day Chest</span> to get qualified in Whitelist
        </Typography>
        <RoundedButton type="solid" text="Check Whitelist on Discord" />
      </div>
      <img className="otto-whitelist__image" src={WhiteListRightBg} />
    </div>
  );
};
export default OttoWhitelistSection;
