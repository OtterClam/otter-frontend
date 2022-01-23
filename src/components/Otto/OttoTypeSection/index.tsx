import { Typography, makeStyles } from '@material-ui/core';
import OttoTypeCard from './OttoTypeCard';
import OttoTypeBg from 'src/assets/images/backgrounds/background-otto_type.png';

import { OTTO_TYPE_METADATA } from './constant';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    zIndex: 0,
    backgroundColor: '#0A0E23',

    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.1,
      background: `url(${OttoTypeBg}) center/contain repeat`,
      zIndex: -1,
    },
  },
  h4: {
    fontSize: '48px',
    fontWeight: 800,
    textAlign: 'center',
    color: theme.palette.otter.white,
    marginBottom: '60px',
  },
}));

const OttoTypeSection = () => {
  const classes = useStyles();
  return (
    <div className={`otto-type__container container ${classes.container}`}>
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
