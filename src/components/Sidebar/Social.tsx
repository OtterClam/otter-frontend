import { SvgIcon, Link } from '@material-ui/core';
import { ReactComponent as GitHub } from 'src/assets/icons/icon_github.svg';
import { ReactComponent as Twitter } from 'src/assets/icons/icon_twitter.svg';
import { ReactComponent as Medium } from 'src/assets/icons/icon_medium.svg';
import { ReactComponent as Docs } from 'src/assets/icons/icon_doc.svg';
import { DocsLink, GithubLink, MediumLink, TwitterLink } from 'src/constants';

export default function Social() {
  return (
    <div className="social-row">
      <Link href={GithubLink} target="_blank">
        <SvgIcon component={GitHub} />
      </Link>

      <Link href={TwitterLink} target="_blank">
        <SvgIcon component={Twitter} />
      </Link>

      <Link href={MediumLink} target="_blank">
        <SvgIcon component={Medium} />
      </Link>

      <Link href={DocsLink} target="_blank">
        <SvgIcon color="primary" component={Docs} />
      </Link>
    </div>
  );
}
