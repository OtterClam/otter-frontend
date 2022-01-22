import { Typography, makeStyles } from '@material-ui/core';
import OttoUsageCard from './OttoUsageCard';
import { OTTO_USAGE_METADATA } from './constant';
import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.white,
  },
  h4: {
    color: theme.palette.mode.otterDark,
    fontSize: '48px',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '40px',
  },
}));

const OtterUsageSection = () => {
  const classes = useStyles();
  return (
    <div className={`otto-usage__container ${classes.container}`}>
      <Typography className={classes.h4} variant="h4">
        What can you do with Ottos?
      </Typography>
      <div className="otto-usage__cards">
        {OTTO_USAGE_METADATA.map(metadata => (
          <OttoUsageCard key={metadata.type} metadata={metadata} />
        ))}
      </div>
    </div>
  );
};
export default OtterUsageSection;
