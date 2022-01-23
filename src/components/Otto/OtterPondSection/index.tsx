import { Typography, makeStyles } from '@material-ui/core';
import OttoPondImage from 'src/assets/images/ottos/otto_pond.png';
import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.lightGray200,
  },
  h4: {
    color: theme.palette.mode.otterDark,
    fontSize: '48px',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '40px',
  },
  h5: {
    fontSize: '36px',
    fontWeight: 800,
    lineHeight: '54px',
  },
  body1: {
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: '30px',
  },
  highlight: {
    color: theme.palette.otter.clamPink,
  },
  image: {
    width: '100%',
    paddingBottom: '100%',
    background: `url(${OttoPondImage}) center/cover no-repeat`,
  },
}));

const OtterPondSection = () => {
  const classes = useStyles();
  return (
    <div className={`otto-pond__container container ${classes.container}`}>
      <Typography className={classes.h4} variant="h4">
        Strengthen Otter Kingdom
      </Typography>
      <div className="otto-pond__section">
        <div className={classes.image} />
        <div className="otto-pond__content">
          <Typography variant="h5" className={classes.h5}>
            Breed Your Ottos
            <br />
            to Get <span className={classes.highlight}>SSR</span> Otto Pups!
          </Typography>
          <Typography variant="body1" className={classes.body1}>
            The rarer the components your Otto comprise, the higher chance of super rare otter pups you will get by
            breeding the male and female Ottos!
          </Typography>
        </div>
      </div>
    </div>
  );
};
export default OtterPondSection;
