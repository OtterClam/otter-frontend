import { getCLAMTokenImage } from 'src/helpers';
import { Link, makeStyles } from '@material-ui/core';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '560px',
    backgroundColor: theme.palette.mode.darkGray400,
    padding: '20px',
    marginTop: '40px',
    border: `2px solid ${theme.palette.mode.darkGray300}`,
    borderRadius: '15px',
  },
  content: {
    color: theme.palette.mode.white,
    fontSize: '16px',
    lineHeight: '24px',
    padding: '0 14px 0 20px',
  },
  highlight: {
    color: theme.palette.otter.clamPink,
    fontSize: '16px',
    lineHeight: '24px',
    wordWrap: 'break-word',
  },
}));

const OttoBuyClamHint = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div>{getCLAMTokenImage(60)}</div>
      <div className={classes.content}>
        The Ottos can be minted only with CLAM. Make
        <br />
        sure you have purchased enough CLAM!
      </div>
      {/* TODO|OTTO: replace with buy clam link */}
      <Link className={classes.highlight} href="/FAKE/buy-clam">
        BUY NOW
      </Link>
    </div>
  );
};
export default OttoBuyClamHint;
