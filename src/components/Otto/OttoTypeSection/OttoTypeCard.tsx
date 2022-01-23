import { Typography, makeStyles } from '@material-ui/core';
import { OttoType, OttoTypeMetadata } from './type';
import OttoMaleImage from 'src/assets/images/ottos/otto_male.png';
import OttoFemaleImage from 'src/assets/images/ottos/otto_female.png';
import OttoNonGenderImage from 'src/assets/images/ottos/otto_non_gender.png';
import OttoPupImage from 'src/assets/images/ottos/otto_pup.png';
import OttoVXImage from 'src/assets/images/ottos/otto_vx.png';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.mode.white,
    borderRadius: '10px',
  },
  h5: {
    color: theme.palette.mode.otterDark,
  },
  countBox: {
    backgroundColor: theme.palette.mode.lightGray400,
  },
}));

interface ImageProps {
  className: string;
  type: OttoType;
}
const OttoImage = ({ className, type }: ImageProps) => {
  const imgSrc = (() => {
    switch (type) {
      case 'otto_female':
        return OttoFemaleImage;
      case 'otto_male':
        return OttoMaleImage;
      case 'otto_non_gender':
        return OttoNonGenderImage;
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
  return (
    <div className={`otto-card__container ${classes.card}`}>
      <h5 className={`otto-card__h5 ${classes.h5}`}>{metadata.name}:</h5>
      <OttoImage className="otto-card__image" type={metadata.type} />
      <p className="otto-card__body2">{metadata.description}</p>
      <div className={`otto-card__countBox ${classes.countBox}`}>
        <p className="otto-card__body2">Population</p>
        {metadata.total === null ? 'Coming Soon' : `0 / ${metadata.total}`}
      </div>
    </div>
  );
};

export default OttoTypeCard;
