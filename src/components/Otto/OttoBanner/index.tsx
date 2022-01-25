import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { ReactComponent as TelegramIcon } from 'src/components/SocialIcons/images/telegram.svg';
import { ReactComponent as DiscordIcon } from 'src/components/SocialIcons/images/discord.svg';
import { ReactComponent as TwitterIcon } from 'src/components/SocialIcons/images/twitter.svg';
import OttoHeroImage from 'src/assets/images/ottos/otto_hero.png';
import OttoHeroBackground from 'src/assets/images/backgrounds/background-banner.png';

import RoundedButton from 'src/components/Otto/common/RoundedButton';
import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    background: `url(${OttoHeroBackground}) center/cover no-repeat`,
  },
  hightlight: {
    color: theme.palette.otter.clamPink,
  },
}));

const OttoBanner = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={`otto-banner__container ${classes.container}`}>
      <div className="otto-banner__section left">
        <h2 className="otto-banner__title">
          {t('otto.banner.meet')} <span className={classes.hightlight}>{t('otto.banner.otto')}</span>!
        </h2>
        <h3 className="otto-banner__slogan">{t('otto.banner.slogan')}</h3>
        <h4 className="otto-banner__description">{t('otto.banner.description')}</h4>
        <div className="otto-banner__buttons">
          <RoundedButton
            href="https://t.me/otterclam_official"
            type="outline"
            icon={TelegramIcon}
            iconSvgProps={{ viewBox: '0 0 32 32' }}
            text="Telegram"
          />
          <RoundedButton
            href="https://discord.gg/otterclam"
            type="outline"
            icon={DiscordIcon}
            iconSvgProps={{ viewBox: '0 0 32 32' }}
            text="Discord"
          />
          <RoundedButton
            href="https://twitter.com/otterclam"
            type="outline"
            icon={TwitterIcon}
            iconSvgProps={{ viewBox: '0 0 32 32' }}
            text="Twitter"
          />
        </div>
      </div>
      <div className="otto-banner__section right">
        <img className="otto-banner__image" src={OttoHeroImage} />
      </div>
    </div>
  );
};
export default OttoBanner;
