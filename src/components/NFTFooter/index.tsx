import { Box, Link } from '@material-ui/core';
import { DiscordLink, GithubLink, MediumLink, TwitterLink } from 'src/constants';
import OtterLogo from './images/otter.png';
import GithubLogo from './images/github.svg';
import DiscordLogo from './images/discord.svg';
import MediumLogo from './images/medium.svg';
import TwitterLogo from './images/twitter.svg';
import './footer.scss';

export default function NFTFooter() {
  return (
    <Box bgcolor="mode.white" component="footer" className="nft-footer">
      <div>
        <Link href={TwitterLink} className="nft-footer__social-link">
          <img className="nft-fotter__social-icon" src={TwitterLogo} />
        </Link>
        <Link href={DiscordLink} className="nft-footer__social-link">
          <img className="nft-fotter__social-icon" src={DiscordLogo} />
        </Link>
        <Link href={GithubLink} className="nft-footer__social-link">
          <img className="nft-fotter__social-icon" src={GithubLogo} />
        </Link>
        <Link href={MediumLink} className="nft-footer__social-link">
          <img className="nft-fotter__social-icon" src={MediumLogo} />
        </Link>
      </div>
      <img src={OtterLogo} className="nft-footer__otter" />
    </Box>
  );
}
