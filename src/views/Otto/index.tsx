import { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { AppThemeContext } from 'src/helpers/app-theme-context';
import OttoHeader from 'src/components/Otto/OttoHeader';
import OttoBanner from 'src/components/Otto/OttoBanner';
import OttoWhitelistSection from 'src/components/Otto/OttoWhitelistSection';
import OttoGetSection from 'src/components/Otto/OttoGetSection';
import OttoTypeSection from 'src/components/Otto/OttoTypeSection';
import OtterKingdomSection from 'src/components/Otto/OtterKingdomSection';

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
      <OttoHeader themeName={themeName} />
      <OttoBanner themeName={themeName} />
      <OttoWhitelistSection />
      <OttoGetSection />
      <OttoTypeSection />
      <OtterKingdomSection />
    </div>
  );
};
export default OttoView;
