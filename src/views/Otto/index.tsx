import { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { AppThemeContext } from 'src/helpers/app-theme-context';
import OttoHeader from 'src/components/Otto/OttoHeader';
import OttoBanner from 'src/components/Otto/OttoBanner';
import OttoWhitelistSection from 'src/components/Otto/OttoWhitelistSection';
import OttoGetSection from 'src/components/Otto/OttoGetSection';
import OttoTypeSection from 'src/components/Otto/OttoTypeSection';
import OttoERCSection from 'src/components/Otto/OttoERCSection';
import OttoFactorySection from 'src/components/Otto/OttoFactorySection';
import OtterPondSection from 'src/components/Otto/OttoPondSection';
import OttoUsageSection from 'src/components/Otto/OtterUsageSection';
import OttoCountdownSection from 'src/components/Otto/OttoCountdownSection';
import OttoFooter from 'src/components/common/Footer';

const useStyles = makeStyles(theme => ({
  view: {
    backgroundColor: theme.palette.mode.white,
    color: theme.palette.mode.otterDark,
  },
}));

const OttoView = () => {
  const classes = useStyles();
  const theme = useContext(AppThemeContext);
  const themeName = theme.name;
  return (
    <div className={classes.view}>
      <OttoHeader />
      <OttoBanner themeName={themeName} />
      <OttoWhitelistSection />
      <OttoGetSection />
      <OttoTypeSection />
      <OttoERCSection />
      <OttoFactorySection />
      <OtterPondSection />
      <OttoUsageSection />
      <OttoCountdownSection />
      <OttoFooter />
    </div>
  );
};
export default OttoView;
