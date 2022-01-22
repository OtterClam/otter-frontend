import { Typography, makeStyles } from '@material-ui/core';
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
}));

const OtterKingdomSection = () => {
  const classes = useStyles();
  return (
    <div className={`otto-kingdom__container ${classes.container}`}>
      <Typography className={classes.h4} variant="h4">
        Strengthen Otter Kingdom
      </Typography>
      <div className="otto-kingdom__section">
        <div className="otto-kingdom__image" />
        <div className="otto-kingdom__content">
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
export default OtterKingdomSection;
