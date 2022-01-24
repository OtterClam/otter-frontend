import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';
import OttoStepBox from './OttoStepBox';

import { DescriptionMetadata } from './type';

import './style.scss';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.mode.lightGray200,
  },
  h4: {
    fontSize: '48px',
    fontWeight: 800,
  },
}));

const OttoGetSection = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const OTTO_STEP_METADATA: DescriptionMetadata[] = useMemo(
    () => [
      {
        imgSrc: '',
        description: [
          { type: 'normal', text: t('otto.get.discord1') },
          { type: 'highlight', text: t('otto.get.discordHighlight') },
          { type: 'normal', text: t('otto.get.discord2') },
        ],
        buttonText: t('otto.get.discordButton'),
      },
      {
        imgSrc: '',
        description: [
          { type: 'normal', text: t('otto.get.buyClam1') },
          { type: 'highlight', text: t('otto.get.buyClamHighlight') },
          { type: 'normal', text: t('otto.get.buyClam2') },
        ],
        buttonText: t('otto.get.butClamButton'),
      },
      {
        imgSrc: '',
        description: [
          { type: 'normal', text: t('otto.get.calendar1') },
          { type: 'highlight', text: t('otto.get.calendarHighlight') },
          { type: 'normal', text: t('otto.get.calendar2') },
        ],
        buttonText: t('otto.get.calendarButton'),
      },
    ],
    [],
  );

  return (
    <div className={`otto-get__container container ${classes.container}`}>
      <Typography className={`${classes.h4} otto-get__title`} variant="h4">
        How to get Ottos?
      </Typography>
      <div className="otto-get__boxes">
        {OTTO_STEP_METADATA.map((metadata, index) => (
          <OttoStepBox key={`step-${index}`} metadata={metadata} number={index + 1} />
        ))}
      </div>
    </div>
  );
};
export default OttoGetSection;
