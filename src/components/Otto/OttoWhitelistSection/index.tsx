import { Typography, makeStyles, useMediaQuery } from '@material-ui/core';
import RoundedButton from 'src/components/Otto/common/RoundedButton';
import WhiteListRightBg from 'src/assets/images/backgrounds/background-otto_whitelist_right.png';
import WhiteListLeftBg from 'src/assets/images/backgrounds/background-otto_whitelist_left.png';
import WhiteListTopBg from 'src/assets/images/backgrounds/background-otto_whitelist_top.png';

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

const customTabletMediaQuery = '(max-width: 1300px)';
const OttoWhitelistSection = () => {
  const classes = useStyles();
  const isTablet = useMediaQuery(customTabletMediaQuery);
  return (
    <div className="otto-whitelist__container">
      {!isTablet && <img className="otto-whitelist__image" src={WhiteListLeftBg} />}
      {isTablet && <img className="otto-whitelist__tablet-image" src={WhiteListTopBg} />}
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
      {!isTablet && <img className="otto-whitelist__image" src={WhiteListRightBg} />}
    </div>
  );
};
export default OttoWhitelistSection;
