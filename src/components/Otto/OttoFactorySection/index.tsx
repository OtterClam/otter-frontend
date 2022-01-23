import ImageTextSection from 'src/components/Otto/common/ImageTextSection';
import ERC71Image from 'src/assets/images/ottos/otto_ERC72.png';

// TODO|OTTO: replace factory image and placeholders

const { ImageSection, TextSection } = ImageTextSection;

const OttoFactorySection = () => {
  return (
    <ImageTextSection
      color="mode.otterDark"
      bgcolor="mode.white"
      title="Otter Factory"
      slogan="Forging and create a new look for your Ottos"
    >
      <ImageSection imgSrc={ERC71Image} />
      <TextSection
        subtitle="Incubate your own Ottos and customize their lookings!"
        content="Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder"
      />
    </ImageTextSection>
  );
};
export default OttoFactorySection;
