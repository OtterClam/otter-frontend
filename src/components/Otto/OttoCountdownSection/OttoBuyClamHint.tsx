import { getCLAMTokenImage } from 'src/helpers';
import { Link, makeStyles } from '@material-ui/core';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.darkGray400,
    border: `2px solid ${theme.palette.mode.darkGray300}`,
  },
  content: {
    color: theme.palette.mode.white,
  },
  highlight: {
    color: theme.palette.otter.clamPink,
  },
}));

const OttoBuyClamHint = () => {
  const classes = useStyles();
  return (
    <div className={`otto-buy-clam-hint__container ${classes.container}`}>
      <div>{getCLAMTokenImage(60)}</div>
      <div className={`otto-buy-clam-hint__content ${classes.content}`}>
        The Ottos can be minted only with CLAM.
        <br /> Make sure you have purchased enough CLAM!
      </div>
      {/* TODO|OTTO: replace with buy clam link */}
      <Link className={`otto-buy-clam-hint__highlight ${classes.highlight}`} href="/FAKE/buy-clam">
        BUY NOW
      </Link>
    </div>
  );
};
export default OttoBuyClamHint;
