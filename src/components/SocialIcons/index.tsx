import { Link, SvgIcon } from '@material-ui/core';
import { DiscordLink, DocsLink, GithubLink, MediumLink, TelegramLink, TwitterLink } from 'src/constants';
import { ReactComponent as TwitterIcon } from './images/twitter.svg';
import { ReactComponent as DiscordIcon } from './images/discord.svg';
import { ReactComponent as GithubIcon } from './images/github.svg';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';
import { ReactComponent as DocIcon } from './images/doc.svg';
import { ReactComponent as MediumIcon } from './images/medium.svg';
import styles from './styles.module.scss';

export type Color = 'blue' | 'gray';

export interface Props {
  color: Color;
}

export default function SocialIcons({ color }: Props) {
  const fillColor = color === 'blue' ? '#3B4BD8' : '#8193B5';
  return (
    <div className={styles.communityIcons}>
      <Link href={DiscordLink} className="community-icon-link">
        <SvgIcon component={DiscordIcon} style={{ width: 32, height: 32 }} viewBox="0 0 32 32" htmlColor={fillColor} />
      </Link>
      <Link href={TelegramLink} className="community-icon-link">
        <SvgIcon component={TelegramIcon} style={{ width: 32, height: 32 }} viewBox="0 0 32 32" htmlColor={fillColor} />
      </Link>
      <Link href={TwitterLink} className="community-icon-link">
        <SvgIcon component={TwitterIcon} style={{ width: 32, height: 32 }} viewBox="0 0 32 32" htmlColor={fillColor} />
      </Link>
      <Link href={GithubLink} className="community-icon-link">
        <SvgIcon component={GithubIcon} style={{ width: 32, height: 32 }} viewBox="0 0 32 32" htmlColor={fillColor} />
      </Link>
      <Link href={DocsLink} className="community-icon-link">
        <SvgIcon component={DocIcon} style={{ width: 32, height: 32 }} viewBox="0 0 32 32" htmlColor={fillColor} />
      </Link>
      <Link href={MediumLink} className="community-icon-link">
        <SvgIcon component={MediumIcon} style={{ width: 32, height: 32 }} viewBox="0 0 32 32" htmlColor={fillColor} />
      </Link>
    </div>
  );
}
