import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';
import OttoUsageCard from './OttoUsageCard';
import { OttoUsageMetadata } from './type';
import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.white,
  },
  h4: {
    color: theme.palette.mode.otterDark,
    fontSize: '48px',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '40px',
  },
}));

const OtterUsageSection = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const OTTO_USAGE_METADATA: OttoUsageMetadata[] = useMemo(
    () => [
      {
        type: 'playable_avatar',
        title: t('otto.usage.playableTitle'),
        content: t('otto.usage.playableContent'),
      },
      {
        type: 'commercial_right',
        title: t('otto.usage.commercialTitle'),
        content: t('otto.usage.commercialContent'),
      },
      {
        type: 'beneficial_ecosystem',
        title: t('otto.usage.beneficialTitle'),
        content: t('otto.usage.beneficialContent'),
      },
    ],
    [],
  );

  return (
    <div className={`otto-usage__container container ${classes.container}`}>
      <Typography className={classes.h4} variant="h4">
        {t('otto.usage.title')}
      </Typography>
      <div className="otto-usage__cards">
        {OTTO_USAGE_METADATA.map(metadata => (
          <OttoUsageCard key={metadata.type} metadata={metadata} />
        ))}
      </div>
    </div>
  );
};
export default OtterUsageSection;
