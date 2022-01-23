import { Link, makeStyles } from '@material-ui/core';
import { LandingPageLink } from 'src/constants';
import NewChip from 'src/components/common/NewChip';
import LanguagePicker from 'src/components/LanguagePicker';
import Logo from './Logo';

import './style.scss';

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.mode.white,
    borderBottom: `1px solid ${theme.palette.mode.lightGray400}`,
  },
}));

export default function OttoDesktopHeader() {
  const classes = useStyles();
  return (
    <header className={`otto-header-desktop ${classes.header}`}>
      <div className="otto-header-desktop__container">
        <div className="otto-header-desktop__section left">
          <a href={LandingPageLink} className="otto-header-logo">
            <Logo />
          </a>
        </div>
        {/* TODO|OTTO: replace navbar links */}
        <div className="otto-header-desktop__section right">
          <Link className="otto-header-desktop__link" href="/FAKE/bank">
            Bank
          </Link>
          <Link className="otto-header-desktop__link" href="/FAKE/otto">
            Otto <NewChip marginLeft="10px" />
          </Link>
          <Link className="otto-header-desktop__link" href="/FAKE/market">
            Market
          </Link>
          <Link className="otto-header-desktop__link" href="/FAKE/treasury">
            Treasury
          </Link>
          <Link className="otto-header-desktop__link" href="/FAKE">
            Getting Started
          </Link>
          <div id="lang-picker">
            <LanguagePicker border={false} />
          </div>
        </div>
      </div>
    </header>
  );
}
