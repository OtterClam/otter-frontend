import { useTranslation } from 'react-i18next';

import { Grid, Typography } from '@material-ui/core';
import './choose-bond.scss';

const BondRowHeader = () => {
  const { t } = useTranslation();
  return (
    <Grid container className="bond-title-row">
      <Grid item xs={1} />
      <Grid item xs={2}>
        <Typography className="bond-row-title first-col" variant="h4" color="secondary">
          {t('common.bond')}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography className="bond-row-title" variant="h4" color="secondary">
          {t('common.price')}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography className="bond-row-title" variant="h4" color="secondary">
          {t('common.roi')}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography className="bond-row-title" variant="h4" color="secondary">
          {t('bonds.purchased')}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography className="bond-row-title" variant="h4" color="secondary">
          {t('bonds.myBond')}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography className="bond-row-title" variant="h4" color="secondary">
          {t('bonds.fullyVestedAt')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default BondRowHeader;
