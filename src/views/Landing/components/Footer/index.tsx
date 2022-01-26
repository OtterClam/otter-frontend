import { Link, Typography } from '@material-ui/core';
import { DiscordLink, DocsLink, GithubLink, TwitterLink } from 'src/constants';
import styles from './footer.module.scss';
import TwitterIcon from '../../images/twitter.svg';
import DiscordIcon from '../../images/icon_discord.svg';
import GithubIcon from '../../images/icon_github.svg';
import DocIcon from '../../images/icon_doc.svg';
import HeaderLogo from 'src/assets/images/header-logo.png';
import PolygonLogo from './polygon-logo.png';
import XIcon from './x-icon.svg';
import { useTranslation } from 'react-i18next';
import SocialIcons from 'src/components/SocialIcons';
import AuditedMark from 'src/components/AuditedMark';
interface LinkButtonProps {
  name: string;
  href: string;
  image: any;
}

function LinkButton({ name, href, image }: LinkButtonProps) {
  return (
    <Link className={styles.linkButton} href={href}>
      <img className={styles.linkImage} src={image} alt={name} />
      <p>{name}</p>
    </Link>
  );
}

export interface Props {
  backgroundColor?: string;
}

export default function Footer({ backgroundColor }: Props) {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer} style={{ backgroundColor }}>
      <h2 className={styles.title}>{t('landing.footer.joinOurCommunity')}</h2>
      <div className={styles.buttonList}>
        <LinkButton name="Twitter" href={TwitterLink} image={TwitterIcon} />
        <LinkButton name="Discord" href={DiscordLink} image={DiscordIcon} />
        <LinkButton name="Github" href={GithubLink} image={GithubIcon} />
        <LinkButton name="Docs" href={DocsLink} image={DocIcon} />
      </div>
      <p className={styles.makeit}>{t('landing.footer.letsMakeIt')} (🦦,🦦)</p>
      <div className={styles.socialIcons}>
        <div className="contact-us">
          <Link href="mailto:dev@otterclam.finance">{t('landing.footer.contactUs')} </Link>
        </div>
        <SocialIcons color="gray" />
      </div>
      <div className={styles.logos}>
        <img src={HeaderLogo} alt="logo" />
        <img src={XIcon} alt="x" style={{ width: 20, height: 20 }} />
        <img src={PolygonLogo} alt="logo" />
      </div>
      <div className={styles.last}>
        <p className={styles.rightsReserved}>© 2022 OtterClam All Rights Reserved</p>
        <AuditedMark />
      </div>
    </footer>
  );
}
