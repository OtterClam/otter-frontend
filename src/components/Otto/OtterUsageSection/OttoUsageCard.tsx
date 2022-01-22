import { Typography, makeStyles } from '@material-ui/core';
import { OttoUsageMetadata, UsageType } from './type';

import BeneficialEcosystemImage from 'src/assets/images/usage/image-beneficial_ecosystem.png';
import CommercialRightImage from 'src/assets/images/usage/image-commercial_right.png';
import PlayableAvatarImage from 'src/assets/images/usage/image-playable_avatar.png';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.mode.lightGray200,
    borderRadius: '10px',
  },
  image: {
    width: '100%',
    maxWidth: '270px',
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
    textAlign: 'center',
    lineHeight: '22px',
    marginBottom: '15px',
  },
}));

interface ImageProps {
  className: string;
  type: UsageType;
}
const UsageImage = ({ className, type }: ImageProps) => {
  const imgSrc = (() => {
    switch (type) {
      case 'playable_avatar':
        return PlayableAvatarImage;
      case 'commercial_right':
        return CommercialRightImage;
      case 'beneficial_ecosystem':
        return BeneficialEcosystemImage;
    }
  })();
  return <img className={className} src={imgSrc} />;
};

interface Props {
  metadata: OttoUsageMetadata;
}
const OttoUsageCard = ({ metadata }: Props) => {
  const classes = useStyles();
  return (
    <div className={`otto-card__container ${classes.card}`}>
      <Typography variant="h5" className={classes.h5}>
        {metadata.title}:
      </Typography>
      <Typography variant="body2" className={classes.body2}>
        {metadata.content}
      </Typography>
      <UsageImage className={classes.image} type={metadata.type} />
    </div>
  );
};
export default OttoUsageCard;
