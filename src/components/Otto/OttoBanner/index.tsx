import { Typography } from '@material-ui/core';
import { ReactComponent as TelegramIcon } from 'src/components/SocialIcons/images/telegram.svg';
import { ReactComponent as DiscordIcon } from 'src/components/SocialIcons/images/discord.svg';

import RoundedButton from 'src/components/Otto/common/RoundedButton';
import './style.scss';

interface Props {
  themeName: string;
}
const OttoBanner = ({ themeName }: Props) => {
  const highlightColor = themeName === 'light' ? 'error' : 'inherit';
  return (
    <div className="otto-banner__container">
      <div className="otto-banner__section left">
        <Typography variant="h2" className="otto-banner__title">
          Get Your{' '}
          <Typography variant="inherit" color={highlightColor}>
            Ottos
          </Typography>{' '}
          in <br /> Otto Kingdom
        </Typography>
        <Typography variant="h5" className="otto-banner__description">
          Ottos are unique and randomly generated 2D NFT Social Avatars for your online experiences. Some appear normal.
          Some look crazy. Some are just damn cool!
        </Typography>
        <div className="otto-banner__buttons">
          <RoundedButton type="outline" icon={TelegramIcon} iconSvgProps={{ viewBox: '0 0 32 32' }} text="Telegram" />
          <RoundedButton
            type="outline"
            icon={DiscordIcon}
            iconSvgProps={{ viewBox: '0 0 32 32' }}
            text="Discord"
            marginLeft="20px"
          />
        </div>
      </div>
      <div className="otto-banner__section right">{/* TODO|OTTO: add banner image */}</div>
    </div>
  );
};
export default OttoBanner;
