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
  image: {
    width: '100%',
    maxWidth: '270px',
    marginBottom: '15px',
  },
  h5: {
    fontSize: '20px',
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: '30px',
    color: theme.palette.mode.otterDark,
    marginBottom: '15px',
  },
  body2: {
    textAlign: 'left',
    lineHeight: '22px',
  },
  countBox: {
    backgroundColor: theme.palette.mode.lightGray400,
    borderRadius: '10px',
    padding: '10px 20px',
    marginTop: '15px',
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
      <Typography variant="h5" className={classes.h5}>
        {metadata.name}:
      </Typography>
      <OttoImage className={classes.image} type={metadata.type} />
      <Typography variant="body2" className={classes.body2}>
        {metadata.description}
      </Typography>
      <div className={classes.countBox}>
        <Typography variant="body2" className={classes.body2}>
          Population
        </Typography>
        {metadata.total === null ? 'Coming Soon' : `0 / ${metadata.total}`}
      </div>
    </div>
  );
};

export default OttoTypeCard;
