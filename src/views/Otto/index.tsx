import { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { OttoThemeContext } from 'src/hooks/theme';
import OttoHeader from 'src/components/Otto/OttoHeader';
import OttoBanner from 'src/components/Otto/OttoBanner';
import OttoWhitelistSection from 'src/components/Otto/OttoWhitelistSection';
import OttoGetSection from 'src/components/Otto/OttoGetSection';
import OttoTypeSection from 'src/components/Otto/OttoTypeSection';
import OttoComponentSection from 'src/components/Otto/OttoComponentSection';
import OttoFactorySection from 'src/components/Otto/OttoFactorySection';
import OtterRiverSection from 'src/components/Otto/OttoRiverSection';
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
  const theme = useContext(OttoThemeContext);
  const themeName = theme.name;
  return (
    <div className={classes.view}>
      <OttoHeader />
      <OttoBanner />
      <OttoWhitelistSection />
      <OttoGetSection />
      <OttoTypeSection />
      <OttoComponentSection />
      <OttoFactorySection />
      <OtterRiverSection />
      <OttoUsageSection />
      <OttoCountdownSection />
      <OttoFooter />
    </div>
  );
};
export default OttoView;
