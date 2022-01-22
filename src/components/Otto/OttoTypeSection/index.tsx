import { Typography, makeStyles } from '@material-ui/core';
import OttoTypeCard from './OttoTypeCard';

import { OTTO_TYPE_METADATA } from './constant';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.otterDark,
  },
  h4: {
    fontSize: '48px',
    fontWeight: 800,
    textAlign: 'center',
    color: theme.palette.mode.white,
    marginBottom: '60px',
  },
}));

const OttoTypeSection = () => {
  const classes = useStyles();
  return (
    <div className={`otto-type__container ${classes.container}`}>
      <Typography className={classes.h4} variant="h4">
        Type of Otto
      </Typography>
      <div className={`otto-type__cards`}>
        {OTTO_TYPE_METADATA.map(metadata => {
          return <OttoTypeCard key={metadata.name} metadata={metadata} />;
        })}
      </div>
    </div>
  );
};
export default OttoTypeSection;
