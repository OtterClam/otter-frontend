import { Link, makeStyles } from '@material-ui/core';
import { LandingPageLink } from 'src/constants';
import { LinkMetadata } from './type';
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

interface Props {
  linkMetadata: LinkMetadata[];
}

export default function OttoDesktopHeader({ linkMetadata }: Props) {
  const classes = useStyles();
  return (
    <header className={`otto-header-desktop ${classes.header}`}>
      <div className="otto-header-desktop__container">
        <div className="otto-header-desktop__section left">
          <a href={LandingPageLink} className="otto-header-logo">
            <Logo />
          </a>
        </div>
        <div className="otto-header-desktop__section right">
          {linkMetadata.map(metadata => (
            <Link className="otto-header-desktop__link" href={metadata.href} target="__blank">
              {metadata.text} {metadata.new && <NewChip marginLeft="10px" />}
            </Link>
          ))}
          <div id="lang-picker">
            <LanguagePicker border={false} />
          </div>
        </div>
      </div>
    </header>
  );
}
