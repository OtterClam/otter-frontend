import { makeStyles } from '@material-ui/core';
import ImageTextSection from '../common/ImageTextSection';
import OttoPondImage from 'src/assets/images/ottos/otto_pond.png';

const { ImageSection, TextSection } = ImageTextSection;

const useStyles = makeStyles(theme => ({
  highlight: {
    color: theme.palette.otter.otterBlue,
  },
}));

const OtterPondSection = () => {
  const classes = useStyles();
  return (
    <ImageTextSection
      color="mode.otterDark"
      bgcolor="mode.lightGray200"
      title="Otter Pond"
      slogan="Inheriting good genes to strengthen the Otter Kingdom"
    >
      <ImageSection imgSrc={OttoPondImage} />
      <TextSection
        subtitle={
          <>
            Breed Your Ottos
            <br />
            to Get <span className={classes.highlight}>SSR</span> Otto Pups!
          </>
        }
        content="The rarer the components your Otto comprise, the higher chance of super rare otter pups you will get by breeding the male and female Ottos!"
      />
    </ImageTextSection>
  );
};
export default OtterPondSection;
