import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';
import OttoTypeCard from './OttoTypeCard';
import OttoTypeBg from 'src/assets/images/backgrounds/background-otto_type.png';

import { OttoTypeMetadata } from './type';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    zIndex: 0,
    backgroundColor: '#0A0E23',

    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.1,
      background: `url(${OttoTypeBg}) center/contain repeat`,
      zIndex: -1,
    },
  },
  h4: {
    fontSize: '48px',
    fontWeight: 800,
    textAlign: 'center',
    color: theme.palette.otter.white,
    marginBottom: '60px',
  },
}));

const OttoTypeSection = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const OTTO_TYPE_METADATA: OttoTypeMetadata[] = useMemo(
    () => [
      {
        name: t('otto.type.ottoName'),
        type: 'otto_otto',
        description: t('otto.type.ottoDescription'),
        total: '2,950',
      },
      {
        name: t('otto.type.lottieName'),
        type: 'otto_lottie',
        description: t('otto.type.lottieDescription'),
        total: '1,950',
      },
      {
        name: t('otto.type.cleoName'),
        type: 'otto_cleo',
        description: t('otto.type.cleoDescription'),
        total: '100',
      },
      {
        name: t('otto.type.pupName'),
        type: 'otto_pup',
        description: t('otto.type.pupDescription'),
        total: null,
      },
      {
        name: t('otto.type.vxName'),
        type: 'otto_vx',
        description: t('otto.type.vxDescription'),
        total: null,
      },
    ],
    [],
  );
  return (
    <div className={`otto-type__container container ${classes.container}`}>
      <Typography className={classes.h4} variant="h4">
        {t('otto.type.title')}
      </Typography>
      <div className={`otto-type__cards`}>
        {OTTO_TYPE_METADATA.map(metadata => {
          return <OttoTypeCard key={metadata.name} metadata={metadata} />;
        })}
      </div>
    </div>
  );
};
export default OttoTypeSection;
