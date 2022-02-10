import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { OttoType, OttoTypeMetadata } from './type';
import OttoOttoImage from 'src/assets/images/ottos/otto_otto.png';
import OttoLottieImage from 'src/assets/images/ottos/otto_lottie.png';
import OttoCleoImage from 'src/assets/images/ottos/otto_cleo.png';
import OttoPupImage from 'src/assets/images/ottos/otto_pup.jpg';
import OttoVXImage from 'src/assets/images/ottos/otto_vx.jpg';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.mode.white,
    borderRadius: '10px',
  },
  h5: {
    color: theme.palette.mode.otterDark,
  },
  countBox: {
    backgroundColor: theme.palette.mode.lightGray300,
  },
}));

interface ImageProps {
  className: string;
  type: OttoType;
}
const OttoImage = ({ className, type }: ImageProps) => {
  const imgSrc = (() => {
    switch (type) {
      case 'otto_lottie':
        return OttoLottieImage;
      case 'otto_otto':
        return OttoOttoImage;
      case 'otto_cleo':
        return OttoCleoImage;
      case 'otto_pup':
        return OttoPupImage;
      case 'otto_vx':
        return OttoVXImage;
    }
  })();
  return <img className={className} src={imgSrc} />;
};

interface Props {
  metadata: OttoTypeMetadata;
}
const OttoTypeCard = ({ metadata }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={`otto-card__container ${classes.card}`}>
      <div>
        <h5 className={`otto-card__h5 ${classes.h5}`}>{metadata.name}</h5>
        <OttoImage className="otto-card__image" type={metadata.type} />
        <p className="otto-card__body2">{metadata.description}</p>
      </div>
      <div className={`otto-card__countBox ${classes.countBox}`}>
        <p className="otto-card__body2">{t('otto.type.population')}</p>
        {metadata.total === null ? t('otto.type.comingSoon') : `0 / ${metadata.total}`}
      </div>
    </div>
  );
};

export default OttoTypeCard;
