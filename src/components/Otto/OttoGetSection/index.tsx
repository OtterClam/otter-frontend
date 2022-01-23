import { Typography, makeStyles } from '@material-ui/core';
import OttoStepBox from './OttoStepBox';

import { OTTO_STEP_METADATA } from './constant';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.lightGray200,
  },
  h4: {
    fontSize: '48px',
    fontWeight: 800,
    marginBottom: '60px',
  },
}));

const OttoGetSection = () => {
  const classes = useStyles();
  return (
    <div className={`otto-get__container container ${classes.container}`}>
      <Typography className={classes.h4} variant="h4">
        How to get Ottos?
      </Typography>
      <div className="otto-get__boxes">
        {OTTO_STEP_METADATA.map((metadata, index) => (
          <OttoStepBox key={`step-${index}`} metadata={metadata} number={index + 1} />
        ))}
      </div>
    </div>
  );
};
export default OttoGetSection;
